// Gunakan fungsi di bawah ini untuk menghasilkan id yang unik
function generateUniqueId() {
  return `_${Math.random().toString(36).slice(2, 9)}`;
}

// TODO: buatlah variabel yang menampung data orders
let orders = [];

// Helper untuk hitung total harga items
function calcTotal(items = []) {
  return items.reduce((sum, it) => sum + (it.price || 0), 0); 
}

// TODO: selesaikan fungsi addOrder
function addOrder(customerName, items) {
  const order = {
    id: generateUniqueId(), 
    customerName, 
    items: Array.isArray(items) ? items : [], 
    totalPrice: calcTotal(items), 
    status: "Menunggu"
  }; 

  orders.push(order); 
  return order; 
}

// TODO: selesaikan fungsi updateOrderStatus
function updateOrderStatus(orderId, status) {
  const allowed = ['Menunggu', 'Diproses', 'Selesai']; 
  if (!allowed.includes(status)) return false; 

  const order = orders.find(o => o.id === orderId);
  if (!order) return false;

  order.status = status;
  return true;
}

// TODO: selesaikan fungsi calculateTotalRevenue dari order yang berstatus Selesai
function calculateTotalRevenue() {
  return orders
    .filter(o => o.status === 'Selesai')
    .reduce((sum, o) => sum + o.totalPrice, 0); 
}

// TODO: selesaikan fungsi deleteOrder
function deleteOrder(id) {
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return false;

  orders.splice(index, 1);
  return true;
}

export { orders, addOrder, updateOrderStatus, calculateTotalRevenue, deleteOrder };
