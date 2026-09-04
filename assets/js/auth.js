(() => {
  const config = window.AshMediaBoostSupabase;
  const hasConfig = config && config.url && config.anonKey && !config.anonKey.includes('REPLACE_WITH');
  let supabaseClient = null;
  if (hasConfig && window.supabase?.createClient) {
    supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  }

  const message = (text, type = 'error') => {
    const el = document.getElementById('formMessage');
    if (el) { el.textContent = text; el.className = `form-message ${type}`; }
  };
  const setBusy = (form, busy) => {
    const button = form?.querySelector('button[type="submit"]');
    if (!button) return;
    if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
    button.disabled = busy;
    button.textContent = busy ? 'Please wait…' : button.dataset.originalText;
  };
  const safeNext = () => {
    const next = new URLSearchParams(location.search).get('next');
    return next && /^(dashboard|account)\.html$/.test(next) ? next : 'account.html';
  };

  async function register(form) {
    if (!supabaseClient) return message('Supabase is not configured yet. Add the project publishable/anon key in assets/js/supabase-config.js.');
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');
    const fullName = String(data.get('name') || '').trim();
    const referralCode = String(data.get('referral') || '').trim().toUpperCase();
    if (password.length < 8) return message('Password must be at least 8 characters.');
    setBusy(form, true); message('Creating your secure account…', 'info');
    try {
      const { data: result, error } = await supabaseClient.auth.signUp({
        email, password,
        options: { data: { full_name: fullName, referral_code_input: referralCode || null }, emailRedirectTo: `${location.origin}/login.html` }
      });
      if (error) throw error;
      if (result.session) { message('Account created. Opening your account…', 'success'); location.replace(safeNext()); }
      else { message('Account created. Check your email to confirm your address, then sign in.', 'success'); form.reset(); }
    } catch (error) { message(error?.message || 'Could not create the account. Please try again.'); }
    finally { setBusy(form, false); }
  }

  async function login(form) {
    if (!supabaseClient) return message('Supabase is not configured yet. Add the project publishable/anon key in assets/js/supabase-config.js.');
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');
    setBusy(form, true); message('Signing you in securely…', 'info');
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      message('Signed in. Opening your account…', 'success'); location.replace(safeNext());
    } catch (error) { message(error?.message || 'Sign in failed. Check your email and password.'); }
    finally { setBusy(form, false); }
  }

  function setup() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    if (registerForm) registerForm.addEventListener('submit', e => { e.preventDefault(); register(registerForm); });
    if (loginForm) loginForm.addEventListener('submit', e => { e.preventDefault(); login(loginForm); });
    const toggle = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    if (toggle && password) toggle.addEventListener('click', () => { const show = password.type === 'password'; password.type = show ? 'text' : 'password'; toggle.textContent = show ? 'Hide' : 'Show'; });
  }

  window.AshMediaBoostAuth = {
    client: () => supabaseClient,
    requireSession: async () => { if (!supabaseClient) return null; const { data } = await supabaseClient.auth.getSession(); if (!data.session) location.replace('login.html?next=account.html'); return data.session; },
    signOut: async () => { if (supabaseClient) await supabaseClient.auth.signOut(); location.replace('login.html'); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
})();
