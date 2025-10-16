import { MainSidebarNav } from '@/components/layout/MainSidebarNav';
import { MainSidebarUI } from '@/components/layout/MainSidebarUI';
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

  const isAdmin = (profile as Profile)?.role === 'site_manager_privilege';

  if (!isAdmin) {
    redirect('/dashboard');
  }
  
  return (
    <div className="flex min-h-screen w-full">
      <MainSidebarUI>
        <MainSidebarNav isAdmin={isAdmin} />
      </MainSidebarUI>
      <div className="flex flex-1 flex-col sm:pl-60">
        <Header user={user} profile={profile as Profile} />
        <main className="flex-1 overflow-y-auto p-4 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
