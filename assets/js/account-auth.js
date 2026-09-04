(() => {
  const config = window.AshMediaBoostSupabase;
  const loadSdk = () => new Promise(resolve => {
    if (window.supabase?.createClient) return resolve(true);
    const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; s.async = true;
    s.onload = () => resolve(!!window.supabase?.createClient); s.onerror = () => resolve(false); document.head.appendChild(s);
  });
  const esc = v => String(v ?? '').replace(/[&<>\'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  document.addEventListener('DOMContentLoaded', async () => {
    if (!config?.url || !config?.anonKey || !(await loadSdk())) { location.replace('login.html?next=account.html'); return; }
    const client = window.supabase.createClient(config.url, config.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    const { data } = await client.auth.getSession(); if (!data.session) { location.replace('login.html?next=account.html'); return; }
    const user = data.session.user;
    const [{ data: profile }, { data: wallet }] = await Promise.all([
      client.from('profiles').select('full_name,username,phone,referral_code,status').eq('id', user.id).maybeSingle(),
      client.from('wallet_accounts').select('currency,available_balance').eq('user_id', user.id).maybeSingle()
    ]);
    const name = esc(profile?.full_name || user.user_metadata?.full_name || 'Member'), email = esc(user.email || '—'), username = esc(profile?.username || 'Not set'), referral = esc(profile?.referral_code || '—'), status = esc(profile?.status || 'active'), currency = esc(wallet?.currency || 'UGX');
    const balance = Number(wallet?.available_balance || 0).toLocaleString('en-UG', { maximumFractionDigits: 2 });
    const card = document.querySelector('.auth-card'); if (!card) return;
    card.innerHTML = `<div class="eyebrow">ASHMEDIABOOST ACCOUNT</div><h2>Welcome, ${name}</h2><p class="muted">Your profile and wallet are securely connected.</p><div class="glass-card" style="padding:18px;margin:18px 0"><div class="eyebrow">WALLET BALANCE</div><div style="font-size:2rem;font-weight:800;margin-top:6px">${currency} ${balance}</div><p class="muted">Wallet changes are controlled by the secure backend.</p></div><div class="glass-card" style="padding:18px;margin:18px 0"><div class="eyebrow">PROFILE</div><p><strong>Email</strong><br>${email}</p><p><strong>Username</strong><br>${username}</p><p><strong>Referral code</strong><br>${referral}</p><p><strong>Status</strong><br>${status}</p></div><div style="display:grid;gap:10px"><a class="btn btn-primary btn-block" href="marketplace.html">Browse marketplace</a><a class="btn btn-ghost btn-block" href="wallet.html">Open wallet</a><button class="btn btn-ghost btn-block" id="accountLogout" type="button">Sign out</button></div>`;
    const logout = document.getElementById('accountLogout'); logout.addEventListener('click', async () => { logout.disabled = true; logout.textContent = 'Signing out…'; await client.auth.signOut(); location.replace('login.html'); });
    const top = document.querySelector('.topbar .btn'); if (top) { top.textContent = 'Account'; top.href = 'account.html'; }
  });
})();
