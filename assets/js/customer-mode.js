/* Shared customer environment. Guest and member UI must never be mixed. */
document.addEventListener('DOMContentLoaded',async()=>{
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const publicPages=new Set(['index.html','marketplace.html','order.html','free-trial.html','guest.html','']);
  const memberPages=new Set(['dashboard.html','wallet.html','tasks.html','account.html','free.html']);
  const authPages=new Set(['login.html','register.html']);
  if(authPages.has(path))return;
  if(!window.supabase)return;
  try{
    const {data:{session}}=await window.supabase.auth.getSession();
    document.documentElement.dataset.customerState=session?'member':'guest';
    const member=!!session;
    if(member && path==='guest.html') location.replace('dashboard.html');
    if(!member && memberPages.has(path)) location.replace('login.html?next='+encodeURIComponent(path));
    if(publicPages.has(path)){
      document.querySelectorAll('[data-guest-only]').forEach(el=>el.hidden=member);
      document.querySelectorAll('[data-member-only]').forEach(el=>el.hidden=!member);
      document.querySelectorAll('[data-auth-link]').forEach(el=>{
        el.textContent=member?'Dashboard':'Sign in';
        el.href=member?'dashboard.html':'login.html';
      });
      document.querySelectorAll('[data-register-link]').forEach(el=>el.hidden=member);
    }
  }catch(e){console.warn('Customer session check unavailable',e)}
});
