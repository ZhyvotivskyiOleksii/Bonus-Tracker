import Link from "next/link"

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t bg-card">
      <div className="container mx-auto px-4 md:px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground space-x-2">
          <span>&copy; {year} sweep-drop</span>
          <span>•</span>
          <a className="underline underline-offset-4" href="mailto:contact@sweep-drop.com">contact@sweep-drop.com</a>
          <span>•</span>
          <Link className="hover:underline underline-offset-4" href="/privacy">Privacy</Link>
          <span>•</span>
          <Link className="hover:underline underline-offset-4" href="/terms">Terms</Link>
          <span>•</span>
          <Link className="hover:underline underline-offset-4" href="/data-deletion">Data Deletion</Link>
        </p>
      </div>
    </footer>
  )
}
