import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Profile } from '@/lib/types';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }
  
  // Ensure profile exists for the logged-in user (fallback in case DB trigger is missing)
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    try {
      await supabase.from('profiles').insert({ id: user.id, username: user.email, role: 'user' });
      const { data: p2 } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      profile = p2 as any;
    } catch {}
  }
  
  return (
    <div className="flex flex-1 flex-col">
      <Header user={user} profile={profile as Profile} showStats={true} />
      <div className="w-full max-w-7xl mx-auto overflow-x-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 md:px-8 py-8 under-header mt-3 sm:mt-4">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
