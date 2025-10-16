
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import sharp from 'sharp';

const casinoSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  casino_url: z.string().url().optional().or(z.literal('')),
  daily_sc: z.coerce.number().optional(),
  daily_gc: z.coerce.number().optional(),
  welcome_sc: z.coerce.number().optional(),
  welcome_gc: z.coerce.number().optional(),
});

type ActionResponse = {
  success: boolean;
  error?: string;
};

// --- DUPLICATE CASINO ---
export async function duplicateCasino(id: string): Promise<ActionResponse> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  // Check user role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'site_manager_privilege') {
    return { success: false, error: 'Not authorized' };
  }

  try {
    // 1. Fetch the original casino
    const { data: originalCasino, error: fetchError } = await supabase
      .from('casinos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw new Error(`DB fetch error: ${fetchError.message}`);
    if (!originalCasino) throw new Error('Original casino not found.');

    // 2. Prepare the new duplicated data
    const { id: originalId, created_at, ...duplicatableData } = originalCasino;
    const newCasinoData = {
      ...duplicatableData,
      name: `${originalCasino.name} (Copy)`,
    };

    // 3. Insert the new casino into the database
    const { error: insertError } = await supabase.from('casinos').insert(newCasinoData);

    if (insertError) throw new Error(`DB insert error: ${insertError.message}`);

    revalidatePath('/admin');
    revalidatePath('/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Duplicate Casino Error:', error);
    return { success: false, error: error.message };
  }
}

// --- UPLOAD LOGO ---
async function uploadLogo(supabase: any, file: File, casinoId: string): Promise<string> {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Convert and optimize image to PNG using sharp
    const pngBuffer = await sharp(fileBuffer)
        .resize({ width: 400 }) // Resize to a max width of 400px, keeping aspect ratio
        .png({ quality: 80 }) // Set PNG quality
        .toBuffer();

    const fileName = `${casinoId}-${Date.now()}.png`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('casino-logos')
        .upload(filePath, pngBuffer, { 
            contentType: 'image/png',
            upsert: true 
        });

    if (uploadError) {
        throw new Error(`Storage error: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from('casino-logos')
        .getPublicUrl(filePath);

    if (!publicUrlData) {
        throw new Error('Could not get public URL for logo');
    }
    
    return publicUrlData.publicUrl;
}

// --- SAVE CASINO (CREATE/UPDATE) ---
export async function saveCasino(formData: FormData): Promise<ActionResponse> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  // Check user role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'site_manager_privilege') {
    return { success: false, error: 'Not authorized' };
  }

  const rawData = Object.fromEntries(formData.entries());
  
  const validation = casinoSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors.toString() };
  }
  
  const { id, ...casinoData } = validation.data;
  const logoFile = formData.get('logo') as File | null;
  let logo_url = formData.get('logo_url') as string || undefined;
  
  try {
    let casinoId = id;
    // 1. If it's a new casino without an ID, create it first to get an ID for the logo path
    if (!id) {
        const { data: newCasino, error: createError } = await supabase
            .from('casinos')
            .insert({ name: casinoData.name })
            .select('id')
            .single();

        if (createError) throw new Error(`DB create error: ${createError.message}`);
        casinoId = newCasino.id;
    }

    if (!casinoId) throw new Error('Casino ID is missing.');

    // 2. Upload logo if present
    if (logoFile && logoFile.size > 0) {
      // If there's an old logo, delete it first.
      if (id && logo_url) {
         try {
            const oldPath = new URL(logo_url).pathname.split('/casino-logos/')[1];
            if (oldPath) {
                await supabase.storage.from('casino-logos').remove([oldPath]);
            }
         } catch(e) {
            console.warn("Could not delete old logo, continuing...", e);
         }
      }
      logo_url = await uploadLogo(supabase, logoFile, casinoId);
    }
    
    // 3. Upsert casino data with all info
    const { error: upsertError } = await supabase
      .from('casinos')
      .update({ ...casinoData, logo_url })
      .eq('id', casinoId);

    if (upsertError) throw new Error(`DB upsert error: ${upsertError.message}`);

    revalidatePath('/admin');
    revalidatePath('/settings');
    return { success: true };

  } catch (error: any) {
    console.error('Save Casino Error:', error);
    return { success: false, error: error.message };
  }
}

// --- DELETE CASINO ---
export async function deleteCasino(id: string, logoUrl?: string | null): Promise<ActionResponse> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  // Check user role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'site_manager_privilege') {
    return { success: false, error: 'Not authorized' };
  }

  try {
    // Delete from DB
    const { error: dbError } = await supabase.from('casinos').delete().eq('id', id);
    if (dbError) throw new Error(`DB error: ${dbError.message}`);

    // Delete logo from Storage
    if (logoUrl) {
      try {
        const path = new URL(logoUrl).pathname.split('/casino-logos/')[1];
        if (path) {
            const { error: storageError } = await supabase.storage.from('casino-logos').remove([path]);
            if (storageError) {
            // Log the error but don't block success, the main record is deleted.
            console.warn(`Storage delete warning: ${storageError.message}`);
            }
        }
      } catch (e) {
         console.warn(`Could not parse or delete logo from storage, continuing...`, e);
      }
    }

    revalidatePath('/admin');
    revalidatePath('/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Delete Casino Error:', error);
    return { success: false, error: error.message };
  }
}
