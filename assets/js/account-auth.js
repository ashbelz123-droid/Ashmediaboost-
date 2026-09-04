document.addEventListener('DOMContentLoaded', async () => {
  const config = window.AshMediaBoostSupabase;
  if (!config?.url || !config?.anonKey || !window.supabase?.createClient) return;
  const client = window.supabase.createClient(config.url, config.anonKey, { auth: { persistSession: true, autoRefreshToken: true } });
  const sessionResult = await client.auth.getSession();
  const session = sessionResult.data?.session;
  if (!session) { location.replace('login.html?next=account.html'); return; }
  const user = session.user;
  const profileResult = await client.from('profiles').select('full_name,username,phone,referral_code,status').eq('id', user.id).maybeSingle();
  const walletResult = await client.from('wallet_accounts').select('currency,available_balance').eq('user_id', user.id).maybeSingle();
  const profile = profileResult.data || {};
  const wallet = walletResult.data || {};
  const name = escapeAccount(profile.full_name || user.user_metadata?.full_name || 'Member');
  const email = escapeAccount(user.email || '—');
  const username = escapeAccount(profile.username || 'Not set');
  const referral = escapeAccount(profile.referral_code || '—');
  const status = escapeAccount(profile.status || 'active');
  const currency = escapeAccount(wallet.currency || 'UGX');
  const balance = Number(wallet.available_balance || 0).toLocaleString('en-UG', { maximumFractionDigits: 2 });
  const card = document.querySelector('.auth-card');
  if (!card) return;
  card.innerHTML = '<div class="eyebrow">ASHMEDIABOOST ACCOUNT</div>' +
    '<h2>Welcome, ' + name + '</h2>' +
    '<p class="muted">Your secure profile and wallet are connected.</p>' +
    '<div class="glass-card" style="padding:18px;margin:18px 0"><div class="eyebrow">WALLET BALANCE</div><div style="font-size:2rem;font-weight:800;margin-top:6px">' + currency + ' ' + balance + '</div><p class="muted">Balance changes are controlled by the secure backend.</p></div>' +
    '<div class="glass-card" style="padding:18px;margin:18px 0"><div class="eyebrow">PROFILE</div><p><strong>Email</strong><br>' + email + '</p><p><strong>Username</strong><br>' + username + '</p><p><strong>Referral code</strong><br>' + referral + '</p><p><strong>Status</strong><br>' + status + '</p></div>' +
    '<div style="display:grid;gap:10px"><a class="btn btn-primary btn-block" href="marketplace.html">Browse marketplace</a><a class="btn btn-ghost btn-block" href="wallet.html">Open wallet</a><button class="btn btn-ghost btn-block" id="accountLogout" type="button">Sign out</button></div>';
  const logout = document.getElementById('accountLogout');
  logout.addEventListener('click', async () => { logout.disabled = true; logout.textContent = 'Signing out…'; await client.auth.signOut(); location.replace('login.html'); });
  const topLogin = document.querySelector('.topbar .btn');
  if (topLogin) { topLogin.textContent = 'Account'; topLogin.href = 'account.html'; }
});
function escapeAccount(value) { return String(value ?? '').replace(/[&<>\'"]/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]; }); }
