module.exports = {
  getServices: async () => [
    { id: "g1", platform: "Instagram", provider: "GodSMM", tier: "Basic", price: 2, speedHours: 5, lifetime: true },
    { id: "g2", platform: "Facebook", provider: "GodSMM", tier: "Pro", price: 5, speedHours: 2, lifetime: false }
  ],
  createOrder: async ({ serviceId, quantity, userId }) => ({ id: "GSMM-" + Math.floor(Math.random()*100000) }),
  getOrderStatus: async (orderId) => ({ status: "completed" })
};
