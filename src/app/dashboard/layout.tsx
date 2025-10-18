import { Header } from '@/components/layout/Header';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Profile } from '@/lib/types';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return (
    <div className="flex flex-1 flex-col">
      <Header user={user} profile={profile as Profile} showStats={true} />
      <div className="w-full max-w-7xl mx-auto overflow-x-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 md:px-8 py-8 under-header mt-3 sm:mt-4">{children}</main>
      </div>
    </div>
  );
}
