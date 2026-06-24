import type {
  Activity,
  Bill,
  Category,
  Food,
  Order,
  Staff,
  Table,
} from "@/types";

export const categories: Category[] = [
  { id: "c1", name: "Pizza", description: "Wood-fired Italian pizzas", totalFoods: 8, createdAt: "2024-01-12", icon: "🍕" },
  { id: "c2", name: "Burgers", description: "Hand-crafted beef & chicken burgers", totalFoods: 6, createdAt: "2024-01-15", icon: "🍔" },
  { id: "c3", name: "Pasta", description: "Authentic Italian pasta dishes", totalFoods: 5, createdAt: "2024-02-02", icon: "🍝" },
  { id: "c4", name: "Salads", description: "Fresh garden salads", totalFoods: 4, createdAt: "2024-02-18", icon: "🥗" },
  { id: "c5", name: "Desserts", description: "Sweet endings", totalFoods: 7, createdAt: "2024-03-01", icon: "🍰" },
  { id: "c6", name: "Beverages", description: "Drinks, juices & coffee", totalFoods: 10, createdAt: "2024-03-12", icon: "🥤" },
  { id: "c7", name: "Steaks", description: "Premium grilled steaks", totalFoods: 4, createdAt: "2024-04-05", icon: "🥩" },
  { id: "c8", name: "Seafood", description: "Fresh catch of the day", totalFoods: 5, createdAt: "2024-04-22", icon: "🦐" },
];

const img = (q: string) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=600&q=80`;

export const foods: Food[] = [
  { id: "f1", name: "Margherita Pizza", description: "Tomato, fresh mozzarella, basil", price: 14.5, image: img("photo-1574071318508-1cdbab80d002"), categoryId: "c1", categoryName: "Pizza", available: true },
  { id: "f2", name: "Pepperoni Pizza", description: "Classic pepperoni with mozzarella", price: 16.0, image: img("photo-1565299624946-b28f40a0ae38"), categoryId: "c1", categoryName: "Pizza", available: true },
  { id: "f3", name: "BBQ Chicken Pizza", description: "BBQ sauce, chicken, red onion", price: 17.5, image: img("photo-1513104890138-7c749659a591"), categoryId: "c1", categoryName: "Pizza", available: false },
  { id: "f4", name: "Classic Beef Burger", description: "Beef patty, cheddar, lettuce", price: 12.0, image: img("photo-1568901346375-23c9450c58cd"), categoryId: "c2", categoryName: "Burgers", available: true },
  { id: "f5", name: "Crispy Chicken Burger", description: "Buttermilk chicken, slaw", price: 11.5, image: img("photo-1606131731446-5568d87113aa"), categoryId: "c2", categoryName: "Burgers", available: true },
  { id: "f6", name: "Spaghetti Carbonara", description: "Pancetta, egg, pecorino", price: 15.0, image: img("photo-1612874742237-6526221588e3"), categoryId: "c3", categoryName: "Pasta", available: true },
  { id: "f7", name: "Penne Arrabbiata", description: "Spicy tomato sauce", price: 13.0, image: img("photo-1551183053-bf91a1d81141"), categoryId: "c3", categoryName: "Pasta", available: true },
  { id: "f8", name: "Caesar Salad", description: "Romaine, parmesan, croutons", price: 9.5, image: img("photo-1546793665-c74683f339c1"), categoryId: "c4", categoryName: "Salads", available: true },
  { id: "f9", name: "Greek Salad", description: "Feta, olives, cucumber", price: 10.0, image: img("photo-1540420773420-3366772f4999"), categoryId: "c4", categoryName: "Salads", available: true },
  { id: "f10", name: "Tiramisu", description: "Espresso-soaked ladyfingers", price: 7.5, image: img("photo-1571877227200-a0d98ea607e9"), categoryId: "c5", categoryName: "Desserts", available: true },
  { id: "f11", name: "Chocolate Lava Cake", description: "Warm molten chocolate", price: 8.0, image: img("photo-1606313564200-e75d5e30476c"), categoryId: "c5", categoryName: "Desserts", available: true },
  { id: "f12", name: "Fresh Lemonade", description: "House-made with mint", price: 4.5, image: img("photo-1621263764928-df1444c5e859"), categoryId: "c6", categoryName: "Beverages", available: true },
  { id: "f13", name: "Cappuccino", description: "Espresso with steamed milk", price: 4.0, image: img("photo-1572442388796-11668a67e53d"), categoryId: "c6", categoryName: "Beverages", available: true },
  { id: "f14", name: "Ribeye Steak", description: "12oz prime ribeye", price: 32.0, image: img("photo-1558030006-450675393462"), categoryId: "c7", categoryName: "Steaks", available: true },
  { id: "f15", name: "Grilled Salmon", description: "Atlantic salmon, lemon butter", price: 24.0, image: img("photo-1467003909585-2f8a72700288"), categoryId: "c8", categoryName: "Seafood", available: true },
  { id: "f16", name: "Garlic Shrimp", description: "Sautéed in garlic butter", price: 18.0, image: img("photo-1565680018434-b513d5e5fd47"), categoryId: "c8", categoryName: "Seafood", available: false },
];

export const tables: Table[] = Array.from({ length: 16 }, (_, i) => {
  const statuses: Table["status"][] = ["Available", "Occupied", "Reserved"];
  return {
    id: `t${i + 1}`,
    number: i + 1,
    capacity: [2, 4, 6, 8][i % 4],
    status: statuses[i % 3],
    location: i < 8 ? "Indoor" : "Outdoor",
  };
});

const avatar = (s: string) => `https://i.pravatar.cc/150?u=${s}`;

export const staff: Staff[] = [
  { id: "s1", name: "Olivia Bennett", email: "olivia@resto.app", phone: "+1 555 0101", position: "Manager", salary: 5200, joiningDate: "2022-03-14", status: "Active", avatar: avatar("olivia") },
  { id: "s2", name: "Marcus Reid", email: "marcus@resto.app", phone: "+1 555 0102", position: "Chef", salary: 4400, joiningDate: "2021-08-22", status: "Active", avatar: avatar("marcus") },
  { id: "s3", name: "Priya Shah", email: "priya@resto.app", phone: "+1 555 0103", position: "Waiter", salary: 2800, joiningDate: "2023-01-09", status: "Active", avatar: avatar("priya") },
  { id: "s4", name: "Daniel Park", email: "daniel@resto.app", phone: "+1 555 0104", position: "Cashier", salary: 3000, joiningDate: "2023-05-30", status: "Active", avatar: avatar("daniel") },
  { id: "s5", name: "Sofia Alvarez", email: "sofia@resto.app", phone: "+1 555 0105", position: "Waiter", salary: 2800, joiningDate: "2023-07-11", status: "On Leave", avatar: avatar("sofia") },
  { id: "s6", name: "Ethan Walker", email: "ethan@resto.app", phone: "+1 555 0106", position: "Chef", salary: 4200, joiningDate: "2022-11-02", status: "Active", avatar: avatar("ethan") },
  { id: "s7", name: "Hana Müller", email: "hana@resto.app", phone: "+1 555 0107", position: "Waiter", salary: 2700, joiningDate: "2024-02-18", status: "Active", avatar: avatar("hana") },
  { id: "s8", name: "Liam O'Connor", email: "liam@resto.app", phone: "+1 555 0108", position: "Cashier", salary: 2900, joiningDate: "2024-04-04", status: "Inactive", avatar: avatar("liam") },
];

const sampleItems = (): { items: Order["items"]; subtotal: number } => {
  const pool = foods.slice(0, 10);
  const count = 1 + Math.floor(Math.random() * 4);
  const items = Array.from({ length: count }, () => {
    const f = pool[Math.floor(Math.random() * pool.length)];
    const qty = 1 + Math.floor(Math.random() * 3);
    return { foodId: f.id, name: f.name, price: f.price, quantity: qty };
  });
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return { items, subtotal };
};

const orderStatuses: Order["status"][] = ["Pending", "Preparing", "Ready", "Served", "Paid", "Cancelled"];

export const orders: Order[] = Array.from({ length: 24 }, (_, i) => {
  const { items, subtotal } = sampleItems();
  const tax = +(subtotal * 0.08).toFixed(2);
  const t = tables[i % tables.length];
  const s = staff[i % staff.length];
  const d = new Date();
  d.setHours(d.getHours() - i * 2);
  return {
    id: `ORD-${1000 + i}`,
    tableId: t.id,
    tableNumber: t.number,
    staffId: s.id,
    staffName: s.name,
    items,
    subtotal: +subtotal.toFixed(2),
    tax,
    total: +(subtotal + tax).toFixed(2),
    status: orderStatuses[i % orderStatuses.length],
    createdAt: d.toISOString(),
    customerName: ["Walk-in", "John Doe", "Jane Smith", "Alex Kim"][i % 4],
  };
});

const paymentMethods: Bill["paymentMethod"][] = ["Cash", "Card", "Mobile Banking"];
const paymentStatuses: Bill["paymentStatus"][] = ["Paid", "Paid", "Paid", "Pending", "Refunded"];

export const bills: Bill[] = orders
  .filter((o) => o.status === "Paid" || o.status === "Served")
  .map((o, i) => ({
    id: `b${i + 1}`,
    invoiceNumber: `INV-${2025000 + i}`,
    orderId: o.id,
    amount: o.subtotal,
    tax: o.tax,
    total: o.total,
    paymentMethod: paymentMethods[i % 3],
    paymentStatus: paymentStatuses[i % paymentStatuses.length],
    date: o.createdAt,
    customerName: o.customerName ?? "Walk-in",
    tableNumber: o.tableNumber,
  }));

export const activities: Activity[] = [
  { id: "a1", type: "order", message: "New order ORD-1023 from Table 4", time: "2 min ago", user: "Priya Shah" },
  { id: "a2", type: "payment", message: "Payment received for INV-2025014", time: "12 min ago", user: "Daniel Park" },
  { id: "a3", type: "menu", message: "Marked 'BBQ Chicken Pizza' as unavailable", time: "1 hr ago", user: "Olivia Bennett" },
  { id: "a4", type: "staff", message: "Sofia Alvarez requested leave", time: "3 hrs ago", user: "Sofia Alvarez" },
  { id: "a5", type: "order", message: "Order ORD-1019 marked as Served", time: "4 hrs ago", user: "Hana Müller" },
  { id: "a6", type: "menu", message: "Added new item: Garlic Shrimp", time: "Yesterday", user: "Marcus Reid" },
];

export const monthlyRevenue = [
  { month: "Jan", revenue: 18200 },
  { month: "Feb", revenue: 21500 },
  { month: "Mar", revenue: 24800 },
  { month: "Apr", revenue: 22100 },
  { month: "May", revenue: 27600 },
  { month: "Jun", revenue: 30200 },
  { month: "Jul", revenue: 32800 },
  { month: "Aug", revenue: 31500 },
  { month: "Sep", revenue: 29400 },
  { month: "Oct", revenue: 33700 },
  { month: "Nov", revenue: 36100 },
  { month: "Dec", revenue: 41200 },
];

export const weeklyOrders = [
  { day: "Mon", orders: 42 },
  { day: "Tue", orders: 51 },
  { day: "Wed", orders: 48 },
  { day: "Thu", orders: 62 },
  { day: "Fri", orders: 87 },
  { day: "Sat", orders: 104 },
  { day: "Sun", orders: 95 },
];

export const topFoods = [
  { name: "Margherita Pizza", sold: 184 },
  { name: "Classic Beef Burger", sold: 162 },
  { name: "Spaghetti Carbonara", sold: 138 },
  { name: "Ribeye Steak", sold: 121 },
  { name: "Caesar Salad", sold: 96 },
];

export const orderStatusDistribution = [
  { name: "Pending", value: 8, color: "var(--color-warning)" },
  { name: "Preparing", value: 12, color: "var(--color-info)" },
  { name: "Ready", value: 6, color: "var(--color-primary)" },
  { name: "Served", value: 18, color: "var(--color-success)" },
  { name: "Cancelled", value: 3, color: "var(--color-destructive)" },
];
