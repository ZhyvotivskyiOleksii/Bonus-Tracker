import { NextResponse } from 'next/server'

// Soft cleanup by default: removes all non-essential cookies (keeps Supabase tokens)
// Use /api/cleanup-cookies?hard=1 to also clear Supabase cookies (this will sign the user out)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hard = searchParams.get('hard') === '1'

  const res = new NextResponse('ok', { status: 200 })
  const cookie = request.headers.get('cookie') || ''

  // Parse simple cookie header into pairs
  const pairs = cookie.split(/;\s*/).filter(Boolean)
  const names = new Set<string>()
  for (const p of pairs) {
    const i = p.indexOf('=')
    const name = i === -1 ? p : p.slice(0, i)
    names.add(name)
  }

  for (const name of names) {
    const isSupabase = name.startsWith('sb-')
    const isReferral = name === 'referral_code'
    if (hard || (!isSupabase && !isReferral)) {
      res.cookies.set({ name, value: '', path: '/', maxAge: 0 })
    }
  }

  return res
}

