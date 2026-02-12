module.exports = {
  getServices: async () => [
    { id: "s1", platform: "TikTok", provider: "SocialShare", tier: "Basic", price: 3, speedHours: 3, lifetime: true },
    { id: "s2", platform: "YouTube", provider: "SocialShare", tier: "Pro", price: 6, speedHours: 1, lifetime: false }
  ],
  createOrder: async ({ serviceId, quantity, userId }) => ({ id: "SSPH-" + Math.floor(Math.random()*100000) }),
  getOrderStatus: async (orderId) => ({ status: "processing" })
};
