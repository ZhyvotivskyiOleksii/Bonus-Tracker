// Minimal Brevo (Sendinblue) contacts client
// Uses REST v3: https://developers.brevo.com/reference/createcontact

type UpsertOptions = {
  listIds?: number[];
  attributes?: Record<string, any>;
  emailBlacklisted?: boolean;
  smsBlacklisted?: boolean;
};

function getBrevoKey(): string | null {
  return process.env.BREVO_API_KEY || process.env.NEXT_PUBLIC_BREVO_API_KEY || null;
}

function getDefaultListIds(): number[] | undefined {
  const val = process.env.BREVO_LIST_ID || process.env.BREVO_LIST_IDS;
  if (!val) return undefined;
  try {
    const ids = val.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => Number.isFinite(n));
    return ids.length ? ids : undefined;
  } catch { return undefined; }
}

export async function brevoUpsertContact(email: string, opts: UpsertOptions = {}) {
  const apiKey = getBrevoKey();
  if (!apiKey) {
    return { success: false, error: 'BREVO_API_KEY not configured' };
  }

  const listIds = opts.listIds ?? getDefaultListIds();

  const body: any = {
    email,
    updateEnabled: true,
  };
  if (listIds && listIds.length) body.listIds = listIds;
  if (opts.attributes) body.attributes = opts.attributes;
  if (typeof opts.emailBlacklisted === 'boolean') body.emailBlacklisted = opts.emailBlacklisted;
  if (typeof opts.smsBlacklisted === 'boolean') body.smsBlacklisted = opts.smsBlacklisted;

  try {
    const endpoint = 'https://api.brevo.com/v3/contacts';
    const doRequest = async (data: any) => fetch(endpoint, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(data),
      // Avoid caching; we want live write
      cache: 'no-store',
    } as any);

    // First attempt
    let res = await doRequest(body);

    // If attributes are not recognized (e.g., USER_ID not created), retry without attributes
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const lower = (text || '').toLowerCase();
      const maybeAttrIssue = res.status === 400 && (lower.includes('attribute') || lower.includes('attributes') || lower.includes('does not exist'));
      if (maybeAttrIssue && body.attributes) {
        const { attributes, ...rest } = body;
        res = await doRequest(rest);
        if (res.ok) return { success: true };
        const retryText = await res.text().catch(() => '');
        return { success: false, error: `Brevo error ${res.status} after retry: ${retryText || text}` };
      }
      return { success: false, error: `Brevo error ${res.status}: ${text}` };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Network error' };
  }
}
