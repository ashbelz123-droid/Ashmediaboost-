(() => {
  const links = [
    ['dashboard.html','⌂','Home'],
    ['marketplace.html','＋','Order'],
    ['tasks.html','★','Tasks'],
    ['wallet.html','◆','Wallet'],
    ['account.html','◉','Account']
  ];
  const current = location.pathname.split('/').pop() || 'index.html';
  function mount(){
    document.querySelectorAll('.mobile-nav').forEach(n => n.remove());
    const nav=document.createElement('nav'); nav.className='mobile-nav panel-nav'; nav.setAttribute('aria-label','Main navigation');
    nav.innerHTML=links.map(([href,icon,label])=>`<a href="${href}" class="${current===href?'nav-active':''}"><span class="nav-icon">${icon}</span><span>${label}</span></a>`).join('');
    document.body.appendChild(nav);
    document.body.classList.add('has-panel-nav');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount); else mount();
})();
