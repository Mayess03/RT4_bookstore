export interface OrderItem {
  bookId: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  totalPrice: number | string;
  status: 'pending' | 'cancelled' | 'completed';
  createdAt: string;
  items: OrderItem[];
}

