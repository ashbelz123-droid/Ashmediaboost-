/* AshMediaBoost pricing engine — provider-independent. Final provider cost is always supplied by the server/provider catalog. */
window.AshMediaBoostPricing=Object.freeze({
  USD_TO_UGX:3700,
  FOLLOWERS_MULTIPLIER:1.5,
  DEFAULT_MULTIPLIER:2,
  currency:'UGX',
  multiplierFor(serviceName=''){
    return /follower|followers|subscriber|subscribers/i.test(String(serviceName)) ? this.FOLLOWERS_MULTIPLIER : this.DEFAULT_MULTIPLIER;
  },
  customerUsd(providerCostUsd,serviceName=''){
    const cost=Number(providerCostUsd);
    if(!Number.isFinite(cost)||cost<0)return null;
    return cost*this.multiplierFor(serviceName);
  },
  customerUgx(providerCostUsd,serviceName=''){
    const usd=this.customerUsd(providerCostUsd,serviceName);
    return usd===null?null:usd*this.USD_TO_UGX;
  },
  formatUgx(amount){
    const value=Number(amount);
    if(!Number.isFinite(value))return '—';
    return new Intl.NumberFormat('en-UG',{style:'currency',currency:'UGX',maximumFractionDigits:0}).format(Math.round(value));
  },
  formatUsd(amount){
    const value=Number(amount);
    if(!Number.isFinite(value))return '—';
    return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:4}).format(value);
  }
});
