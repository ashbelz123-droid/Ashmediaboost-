(() => {
  const config = window.AshMediaBoostSupabase || { url: 'https://qwjtndamcivxdgsyzgsg.supabase.co', anonKey: 'sb_publishable_nGrpDCmsuRMAewqnOjY6xQ_clo8A27a' };
  let supabaseClient = null;
  const message = (text, type = 'error') => { const el = document.getElementById('formMessage'); if (el) { el.textContent = text; el.className = `form-message ${type}`; } };
  const setBusy = (form, busy) => { const b = form?.querySelector('button[type="submit"]'); if (!b) return; if (!b.dataset.originalText) b.dataset.originalText = b.textContent; b.disabled = busy; b.textContent = busy ? 'Please wait…' : b.dataset.originalText; };
  const safeNext = () => { const next = new URLSearchParams(location.search).get('next'); return next && /^(dashboard|account)\.html$/.test(next) ? next : 'account.html'; };
  function loadSupabase() {
    if (!config?.url || !config?.anonKey) return Promise.resolve(false);
    if (window.supabase?.createClient) return Promise.resolve(true);
    return new Promise(resolve => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; s.onload = () => resolve(!!window.supabase?.createClient); s.onerror = () => resolve(false); document.head.appendChild(s); });
  }
  async function bootstrap() { const loaded = await loadSupabase(); if (loaded) supabaseClient = window.supabase.createClient(config.url, config.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }); setup(); }
  async function register(form) {
    if (!supabaseClient) return message('Supabase could not be loaded. Refresh and try again.');
    const d = new FormData(form), email = String(d.get('email') || '').trim().toLowerCase(), password = String(d.get('password') || ''), fullName = String(d.get('name') || '').trim(), referralCode = String(d.get('referral') || '').trim().toUpperCase();
    if (password.length < 8) return message('Password must be at least 8 characters.');
    setBusy(form, true); message('Creating your secure account…', 'info');
    try { const { data: result, error } = await supabaseClient.auth.signUp({ email, password, options: { data: { full_name: fullName, referral_code_input: referralCode || null }, emailRedirectTo: `${location.origin}/login.html` } }); if (error) throw error; if (result.session) { message('Account created. Opening your account…', 'success'); location.replace(safeNext()); } else { message('Account created. Check your email to confirm your address, then sign in.', 'success'); form.reset(); } }
    catch (error) { message(error?.message || 'Could not create the account. Please try again.'); } finally { setBusy(form, false); }
  }
  async function login(form) {
    if (!supabaseClient) return message('Supabase could not be loaded. Refresh and try again.');
    const d = new FormData(form), email = String(d.get('email') || '').trim().toLowerCase(), password = String(d.get('password') || '');
    setBusy(form, true); message('Signing you in securely…', 'info');
    try { const { error } = await supabaseClient.auth.signInWithPassword({ email, password }); if (error) throw error; message('Signed in. Opening your account…', 'success'); location.replace(safeNext()); }
    catch (error) { message(error?.message || 'Sign in failed. Check your email and password.'); } finally { setBusy(form, false); }
  }
  function setup() {
    const reg = document.getElementById('registerForm'), login = document.getElementById('loginForm');
    if (reg && !reg.dataset.authBound) { reg.dataset.authBound = '1'; reg.addEventListener('submit', e => { e.preventDefault(); e.stopImmediatePropagation(); register(reg); }, true); }
    if (login && !login.dataset.authBound) { login.dataset.authBound = '1'; login.addEventListener('submit', e => { e.preventDefault(); e.stopImmediatePropagation(); loginSubmit(login); }, true); }
    const t = document.getElementById('togglePassword'), p = document.getElementById('password'); if (t && p && !t.dataset.bound) { t.dataset.bound = '1'; t.addEventListener('click', () => { const show = p.type === 'password'; p.type = show ? 'text' : 'password'; t.textContent = show ? 'Hide' : 'Show'; }); }
  }
  const loginSubmit = login;
  window.AshMediaBoostAuth = { client: () => supabaseClient, requireSession: async () => { if (!supabaseClient) return null; const { data } = await supabaseClient.auth.getSession(); if (!data.session) { location.replace('login.html?next=account.html'); return null; } return data.session; }, signOut: async () => { if (supabaseClient) await supabaseClient.auth.signOut(); location.replace('login.html'); } };
  bootstrap();
})();
