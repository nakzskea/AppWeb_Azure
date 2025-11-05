export const mockProducts = [
  {
    id: 1,
    name: "Professional Laptop Stand",
    price: 89.99,
    description: "Ergonomic aluminum laptop stand for improved posture",
    category: "Accessories",
    image: "/laptop-stand.png",
    stock: 45,
  },
  {
    id: 2,
    name: "Wireless Mouse & Keyboard",
    price: 129.99,
    description: "Compact wireless combo set with 2.4GHz connection",
    category: "Peripherals",
    image: "/wireless-mouse-keyboard.jpg",
    stock: 62,
  },
  {
    id: 3,
    name: "USB-C Hub Adapter",
    price: 49.99,
    description: "7-in-1 USB-C hub with multiple ports",
    category: "Connectors",
    image: "/usb-hub.png",
    stock: 103,
  },
  {
    id: 4,
    name: "4K USB Webcam",
    price: 159.99,
    description: "Professional 4K webcam with auto-focus",
    category: "Cameras",
    image: "/4k-webcam.png",
    stock: 28,
  },
  {
    id: 5,
    name: "Portable SSD 1TB",
    price: 119.99,
    description: "Fast external solid-state drive for backup",
    category: "Storage",
    image: "/portable-ssd.jpg",
    stock: 35,
  },
  {
    id: 6,
    name: "Premium Monitor Arm",
    price: 99.99,
    description: "VESA-compatible adjustable monitor mount",
    category: "Accessories",
    image: "/monitor-arm.jpg",
    stock: 41,
  },
]

export const mockUsers = [
  {
    id: 1,
    email: "alice@example.com",
    name: "Alice Johnson",
    status: "active",
    joinedDate: "2024-01-15",
    orders: 8,
  },
  {
    id: 2,
    email: "bob@example.com",
    name: "Bob Smith",
    status: "active",
    joinedDate: "2024-02-20",
    orders: 3,
  },
  {
    id: 3,
    email: "carol@example.com",
    name: "Carol Williams",
    status: "blocked",
    joinedDate: "2024-03-10",
    orders: 1,
  },
]

export const mockOrders = [
  {
    id: "ORD-001",
    userId: 1,
    date: "2024-10-15",
    total: 349.97,
    status: "delivered",
    items: 3,
  },
  {
    id: "ORD-002",
    userId: 1,
    date: "2024-09-08",
    total: 89.99,
    status: "delivered",
    items: 1,
  },
  {
    id: "ORD-003",
    userId: 2,
    date: "2024-10-20",
    total: 199.98,
    status: "pending",
    items: 2,
  },
]

export interface Product {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
  stock: number
}

export interface User {
  id: number
  email: string
  name: string
  status: "active" | "blocked"
  joinedDate: string
  orders: number
}

export interface Order {
  id: string
  userId: number
  date: string
  total: number
  status: "pending" | "delivered" | "cancelled"
  items: number
}

export interface CartItem extends Product {
  quantity: number
}
