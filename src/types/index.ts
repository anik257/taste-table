export type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Served"
  | "Paid"
  | "Cancelled";

export type TableStatus = "Available" | "Reserved" | "Occupied";

export type StaffPosition = "Manager" | "Waiter" | "Chef" | "Cashier";

export type PaymentMethod = "Cash" | "Card" | "Mobile Banking";

export type PaymentStatus = "Paid" | "Pending" | "Refunded";

export interface Category {
  id: string;
  name: string;
  description: string;
  totalFoods: number;
  createdAt: string;
  icon: string;
}

export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  categoryName: string;
  available: boolean;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  location: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: StaffPosition;
  salary: number;
  joiningDate: string;
  status: "Active" | "On Leave" | "Inactive";
  avatar: string;
}

export interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  staffId: string;
  staffName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  customerName?: string;
}

export interface Bill {
  id: string;
  invoiceNumber: string;
  orderId: string;
  amount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  date: string;
  customerName: string;
  tableNumber: number;
}

export interface Activity {
  id: string;
  type: "order" | "payment" | "staff" | "menu";
  message: string;
  time: string;
  user: string;
}
