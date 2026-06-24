import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  Armchair,
  ClipboardList,
  Users,
  Receipt,
  BarChart3,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Menu", url: "/menu", icon: UtensilsCrossed },
  { title: "Categories", url: "/categories", icon: Tags },
  { title: "Tables", url: "/tables", icon: Armchair },
  { title: "Orders", url: "/orders", icon: ClipboardList },
  { title: "Staff", url: "/staff", icon: Users },
  { title: "Billing", url: "/billing", icon: Receipt },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export const ORDER_STATUSES = [
  "Pending",
  "Preparing",
  "Ready",
  "Served",
  "Paid",
  "Cancelled",
] as const;

export const TABLE_STATUSES = ["Available", "Reserved", "Occupied"] as const;

export const STAFF_POSITIONS = ["Manager", "Waiter", "Chef", "Cashier"] as const;

export const PAYMENT_METHODS = ["Cash", "Card", "Mobile Banking"] as const;
