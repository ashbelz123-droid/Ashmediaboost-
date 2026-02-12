module.exports = {
  getServices: async () => [
    { id: "m1", platform: "Instagram", provider: "SMMGen", tier: "Starter", price: 1, speedHours: 5, lifetime: true },
    { id: "m2", platform: "Facebook", provider: "SMMGen", tier: "Advanced", price: 4, speedHours: 2, lifetime: false }
  ],
  createOrder: async ({ serviceId, quantity, userId }) => ({ id: "SMGEN-" + Math.floor(Math.random()*100000) }),
  getOrderStatus: async (orderId) => ({ status: "pending" })
};
