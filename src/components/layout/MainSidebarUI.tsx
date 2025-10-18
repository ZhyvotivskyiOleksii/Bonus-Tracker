
export function MainSidebarUI({ children }: { children: React.ReactNode }) {
  return (
    <aside className="fixed top-14 bottom-0 left-0 z-10 hidden w-60 flex-col bg-transparent sm:flex">
      <nav className="flex flex-col gap-4 px-4 sm:py-5">
        <div className="flex flex-col gap-y-2 mt-2">
          {children}
        </div>
      </nav>
    </aside>
  );
}
