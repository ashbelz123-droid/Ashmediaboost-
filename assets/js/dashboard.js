(() => {
  const config = window.AshMediaBoostSupabase;
  const sdkUrl = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  const loadSdk = () => new Promise(resolve => {
    if (window.supabase?.createClient) return resolve(true);
    const s = document.createElement('script'); s.src = sdkUrl; s.async = true;
    s.onload = () => resolve(!!window.supabase?.createClient);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
  const esc = v => String(v ?? '').replace(/[&<>\'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const money = n => Number(n || 0).toLocaleString('en-UG', { maximumFractionDigits: 2 });
  const initials = name => String(name || 'A').trim().slice(0, 1).toUpperCase();

  document.addEventListener('DOMContentLoaded', async () => {
    if (!config?.url || !config?.anonKey || !(await loadSdk())) return location.replace('login.html?next=dashboard.html');
    const client = window.supabase.createClient(config.url, config.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session) return location.replace('login.html?next=dashboard.html');
    const user = sessionData.session.user;

    const [{ data: profile }, { data: wallet }, { count: orderCount }, { data: orders }] = await Promise.all([
      client.from('profiles').select('full_name,username,referral_code,status').eq('id', user.id).maybeSingle(),
      client.from('wallet_accounts').select('currency,available_balance').eq('user_id', user.id).maybeSingle(),
      client.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      client.from('orders').select('order_number,status,customer_price,currency,created_at,services(name,platform)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
    ]);

    const name = profile?.full_name || user.user_metadata?.full_name || profile?.username || 'Member';
    const currency = wallet?.currency || 'UGX';
    document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = name);
    document.querySelector('[data-avatar]').textContent = initials(name);
    document.querySelector('[data-email]').textContent = user.email || '—';
    document.querySelector('[data-balance]').textContent = `${currency} ${money(wallet?.available_balance)}`;
    document.querySelector('[data-order-count]').textContent = orderCount ?? 0;
    document.querySelector('[data-referral]').textContent = profile?.referral_code || '—';

    const list = document.querySelector('[data-orders]');
    if (!orders?.length) {
      list.innerHTML = '<div class="dash-empty"><div class="empty-icon">⌁</div><strong>No orders yet</strong><span>Your completed orders will appear here.</span><a class="panel-btn panel-btn-primary" href="marketplace.html">Browse services</a></div>';
    } else {
      list.innerHTML = orders.map(o => {
        const status = esc(o.status || 'pending').replace(/_/g, ' ');
        return `<div class="order-row"><div class="order-main"><strong>#${esc(o.order_number)}</strong><span>${esc(o.services?.name || 'Service')}</span></div><div class="order-side"><b>${esc(o.currency || currency)} ${money(o.customer_price)}</b><em class="status status-${esc(o.status || 'pending')}">${status}</em></div></div>`;
      }).join('');
    }

    document.querySelector('[data-copy-ref]')?.addEventListener('click', async () => {
      if (!profile?.referral_code) return;
      try { await navigator.clipboard.writeText(profile.referral_code); } catch (_) {}
      const b = document.querySelector('[data-copy-ref]'); b.textContent = 'Copied'; setTimeout(() => b.textContent = 'Copy', 1400);
    });

    document.querySelector('[data-logout]')?.addEventListener('click', async () => {
      const b = document.querySelector('[data-logout]'); b.disabled = true; b.textContent = 'Signing out…';
      await client.auth.signOut(); location.replace('login.html');
    });

    document.querySelector('[data-menu]')?.addEventListener('click', () => document.body.classList.toggle('menu-open'));
    document.querySelector('[data-overlay]')?.addEventListener('click', () => document.body.classList.remove('menu-open'));
  });
})();
