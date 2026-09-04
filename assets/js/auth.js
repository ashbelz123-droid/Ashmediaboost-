(() => {
  const config = window.AshMediaBoostSupabase;
  let client = null;
  const $ = id => document.getElementById(id);
  const show = (text, type = 'error') => { const el = $('formMessage'); if (el) { el.textContent = text; el.className = `form-message ${type}`; } };
  const busy = (form, on, label) => { const b = form?.querySelector('button[type="submit"]'); if (!b) return; if (!b.dataset.original) b.dataset.original = b.textContent; b.disabled = on; b.textContent = on ? label : b.dataset.original; };
  const nextPage = () => { const n = new URLSearchParams(location.search).get('next'); return /^(account|dashboard)\.html$/.test(n || '') ? n : 'account.html'; };
  const loadSdk = () => new Promise(resolve => { if (window.supabase?.createClient) return resolve(true); const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; s.async = true; s.onload = () => resolve(!!window.supabase?.createClient); s.onerror = () => resolve(false); document.head.appendChild(s); });
  async function init() {
    if (!config?.url || !config?.anonKey) return show('Secure connection is not configured. Please refresh.', 'error');
    if (!(await loadSdk())) return show('Secure connection could not be loaded. Check your internet connection and refresh.', 'error');
    client = window.supabase.createClient(config.url, config.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    setup();
    const { data } = await client.auth.getSession();
    if (data.session && /^(login|register)\.html$/.test(location.pathname.split('/').pop() || '')) location.replace(nextPage());
  }
  async function register(form) {
    if (!client) return show('Secure connection is not ready. Refresh the page.');
    const d = new FormData(form), email = String(d.get('email') || '').trim().toLowerCase(), password = String(d.get('password') || ''), fullName = String(d.get('name') || '').trim(), referral = String(d.get('referral') || '').trim().toUpperCase();
    if (password.length < 8) return show('Password must be at least 8 characters.');
    busy(form, true, 'Creating account…'); show('Creating your secure account…', 'info');
    try {
      const { data, error } = await client.auth.signUp({ email, password, options: { data: { full_name: fullName, referral_code_input: referral || null }, emailRedirectTo: `${location.origin}/login.html` } });
      if (error) throw error;
      if (data.session) location.replace(nextPage()); else { form.reset(); show('Account created. Check your email to confirm your address, then sign in.', 'success'); }
    } catch (e) { show(e?.message || 'Could not create the account. Please try again.'); }
    finally { busy(form, false); }
  }
  async function login(form) {
    if (!client) return show('Secure connection is not ready. Refresh the page.');
    const d = new FormData(form), email = String(d.get('email') || '').trim().toLowerCase(), password = String(d.get('password') || '');
    busy(form, true, 'Signing in…'); show('Signing you in securely…', 'info');
    try { const { error } = await client.auth.signInWithPassword({ email, password }); if (error) throw error; location.replace(nextPage()); }
    catch (e) { show(e?.message || 'Sign in failed. Check your email and password.'); }
    finally { busy(form, false); }
  }
  async function resetPassword() {
    if (!client) return show('Secure connection is not ready. Refresh the page.');
    const email = String($('email')?.value || '').trim().toLowerCase();
    if (!email) return show('Enter your email address first.');
    try { const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/login.html` }); if (error) throw error; show('If that email has an account, a password-reset link has been sent.', 'success'); }
    catch (e) { show(e?.message || 'Could not send the reset email.'); }
  }
  function setup() {
    const r = $('registerForm'), l = $('loginForm');
    if (r && !r.dataset.bound) { r.dataset.bound = '1'; r.addEventListener('submit', e => { e.preventDefault(); e.stopImmediatePropagation(); register(r); }, true); }
    if (l && !l.dataset.bound) { l.dataset.bound = '1'; l.addEventListener('submit', e => { e.preventDefault(); e.stopImmediatePropagation(); login(l); }, true); }
    const t = $('togglePassword'), p = $('password'); if (t && p && !t.dataset.bound) { t.dataset.bound = '1'; t.dataset.bound = '1'; t.addEventListener('click', () => { const s = p.type === 'password'; p.type = s ? 'text' : 'password'; t.textContent = s ? 'Hide' : 'Show'; }); }
    const f = $('forgotPassword'); if (f && !f.dataset.bound) { f.dataset.bound = '1'; f.addEventListener('click', e => { e.preventDefault(); resetPassword(); }); }
  }
  window.AshMediaBoostAuth = { client: () => client, requireSession: async () => { if (!client) return null; const { data } = await client.auth.getSession(); if (!data.session) { location.replace('login.html?next=account.html'); return null; } return data.session; }, signOut: async () => { if (client) await client.auth.signOut(); location.replace('login.html'); } };
  init();
})();
