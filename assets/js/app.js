document.addEventListener('DOMContentLoaded',()=>{
  const y=document.getElementById('year'); if(y)y.textContent=new Date().getFullYear();
  const link=document.getElementById('quick-link');
  if(link)link.addEventListener('input',()=>link.setCustomValidity(link.value&&!/^https?:\/\//i.test(link.value)?'Enter a valid public URL beginning with http:// or https://':''));

  const current=location.pathname.split('/').pop()||'index.html';
  const customerPages=['index.html','dashboard.html','marketplace.html','order.html','tasks.html','wallet.html','account.html','free.html','free-trial.html',''];
  if(customerPages.includes(current)&&!document.querySelector('.auth-page')){
    // One navigation system only. Remove every page-specific/legacy version first.
    document.querySelectorAll('.mobile-bottom,.mobile-nav,.bottom-nav').forEach(n=>n.remove());
    const nav=document.createElement('nav');
    nav.className='mobile-nav panel-nav';
    nav.setAttribute('aria-label','Main navigation');
    const homeActive=current==='index.html'||current==='dashboard.html';
    const items=[
      ['index.html','⌂','Home',homeActive],
      ['order.html','⊕','Order',current==='order.html'],
      ['wallet.html','▣','Wallet',current==='wallet.html'],
      ['tasks.html','☷','Activity',current==='tasks.html'],
      ['account.html','♙','Account',current==='account.html']
    ];
    nav.innerHTML=items.map(([href,icon,label,active])=>`<a href="${href}" class="${active?'nav-active':''}"><span class="nav-icon">${icon}</span><span>${label}</span></a>`).join('');
    document.body.appendChild(nav);
    document.body.classList.add('has-panel-nav');
    if(!document.getElementById('panel-nav-style')){
      const s=document.createElement('style'); s.id='panel-nav-style';
      s.textContent=`
        .has-panel-nav{padding-bottom:88px!important}
        .panel-nav{position:fixed!important;z-index:1000!important;left:50%!important;bottom:max(8px,env(safe-area-inset-bottom))!important;transform:translateX(-50%)!important;width:min(calc(100% - 24px),560px)!important;min-height:60px!important;padding:6px!important;box-sizing:border-box!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:22px!important;background:rgba(5,9,18,.96)!important;backdrop-filter:blur(20px)!important;-webkit-backdrop-filter:blur(20px)!important;box-shadow:0 14px 45px rgba(0,0,0,.42)!important;display:grid!important;grid-template-columns:repeat(5,1fr)!important;gap:4px!important}
        .panel-nav a{display:grid!important;place-items:center!important;align-content:center!important;gap:4px!important;min-width:0!important;min-height:46px!important;border-radius:15px!important;color:#778399!important;text-decoration:none!important;font-size:9px!important;font-weight:850!important;transition:transform .15s ease,background .15s ease,color .15s ease!important}
        .panel-nav .nav-icon{font-size:20px!important;line-height:1!important}
        .panel-nav a.nav-active{color:#fff!important;background:linear-gradient(135deg,rgba(35,159,255,.12),rgba(139,77,255,.15),rgba(255,62,158,.08))!important;box-shadow:inset 0 0 0 1px rgba(139,77,255,.16)!important}
        .panel-nav a.nav-active .nav-icon{color:#b98cff!important}
        .panel-nav a:active{transform:scale(.94)!important}
        /* Kill old green states left by legacy page CSS. */
        .status,.service-status,.status-dot,.ready,.platform.selected .platform-check{background-color:transparent}
        .status,.service-status{color:#b98cff!important;border-color:rgba(139,92,246,.24)!important}
        .status-dot{background:#ff9418!important;box-shadow:0 0 12px rgba(255,148,24,.65)!important}
        .ready{color:#b9a4ff!important;border-color:rgba(139,92,246,.24)!important}
        @media(max-width:360px){.panel-nav{width:calc(100% - 16px)!important;padding:5px!important}.panel-nav a{font-size:8px!important;min-height:44px!important}.panel-nav .nav-icon{font-size:18px!important}}
        @media(min-width:900px){.panel-nav{width:470px!important;bottom:18px!important}.has-panel-nav{padding-bottom:32px!important}}
      `; document.head.appendChild(s);
    }
  }

  if(current==='order.html'){
    const palette={'Instagram':'#E1306C','TikTok':'#25F4EE','YouTube':'#FF0033','WhatsApp':'#25D366','Telegram':'#229ED9','Facebook':'#1877F2','X / Twitter':'#FFFFFF','Snapchat':'#FFFC00','Pinterest':'#E60023','LinkedIn':'#0A66C2','Spotify':'#1DB954','SoundCloud':'#FF5500','Twitch':'#9146FF','Website / SEO':'#8B5CF6'};
    const style=document.createElement('style');
    style.textContent=`
      .order-live{display:flex;gap:6px;flex-wrap:wrap;margin:-5px 0 12px}
      .order-live-pill{display:inline-flex;align-items:center;gap:5px;padding:6px 8px;border:1px solid rgba(255,255,255,.07);border-radius:999px;background:rgba(255,255,255,.025);color:#7d899d;font-size:7px;font-weight:850}.order-live-pill b{color:#f2f5f9;font-size:8px}
      .platform{position:relative;overflow:hidden}.platform.selected{border-color:var(--platform-color)!important;background:linear-gradient(135deg,color-mix(in srgb,var(--platform-color) 18%,transparent),rgba(10,15,28,.96))!important;box-shadow:0 0 0 1px color-mix(in srgb,var(--platform-color) 28%,transparent),0 7px 20px color-mix(in srgb,var(--platform-color) 10%,transparent)}
      .platform.selected .platform-icon{border-color:color-mix(in srgb,var(--platform-color) 55%,transparent);background:color-mix(in srgb,var(--platform-color) 10%,#080d18)}.platform.selected .platform-check{background:var(--platform-color)!important;color:#080b12!important}
      .service.selected{border-color:#8B5CF6!important;background:rgba(139,92,246,.08)!important;box-shadow:0 0 0 1px rgba(139,92,246,.12)}.service.selected .service-icon{background:rgba(139,92,246,.16);color:#c9b7ff}.ready{color:#b9a4ff!important;border-color:rgba(139,92,246,.24)!important}
      .platform-count{display:block;margin-top:2px;color:#59667b;font-size:6px;font-weight:750}.order-live-pill .live-dot{width:5px;height:5px;border-radius:50%;background:#ff9418;box-shadow:0 0 8px rgba(255,148,24,.7)}
      @media(max-width:420px){.order-live{margin:-3px 0 10px}.order-live-pill{font-size:6.5px;padding:5px 7px}.order-live-pill b{font-size:7.5px}.platform-count{font-size:5.5px}}
    `; document.head.appendChild(style);
    const grid=document.getElementById('platformGrid');
    if(grid){
      const live=document.createElement('div'); live.className='order-live';
      live.innerHTML='<span class="order-live-pill"><i class="live-dot"></i><b id="platformCount">0</b> platforms available</span><span class="order-live-pill"><b id="selectedCount">0</b> service categories</span>';
      grid.parentElement.parentElement.insertBefore(live,grid);
      function animateNumber(el,target){if(!el)return;let start=0;const step=()=>{start=Math.min(target,start+Math.max(1,Math.ceil(target/10)));el.textContent=start;if(start<target)requestAnimationFrame(step)};step()}
      function decorate(){const buttons=[...grid.querySelectorAll('.platform')];buttons.forEach(btn=>{const name=(btn.querySelector('.platform-name')?.textContent||btn.dataset.platform||'').trim();const color=palette[name]||'#8B5CF6';btn.dataset.platform=name;btn.style.setProperty('--platform-color',color);if(!btn.querySelector('.platform-count')){const count=document.createElement('span');count.className='platform-count';count.textContent='Tap to choose';const nameEl=btn.querySelector('.platform-name');if(nameEl)nameEl.insertAdjacentElement('afterend',count)}});animateNumber(document.getElementById('platformCount'),buttons.length)}
      function updateCategoryCount(){const el=document.getElementById('selectedCount');const count=document.querySelectorAll('#categoryRow .category').length;if(el)el.textContent=count}
      decorate();updateCategoryCount();
      const observer=new MutationObserver(()=>{decorate();updateCategoryCount()}); observer.observe(grid,{childList:true});
      const cat=document.getElementById('categoryRow'); if(cat)new MutationObserver(updateCategoryCount).observe(cat,{childList:true});
    }
  }
});