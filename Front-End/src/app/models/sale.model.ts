import { Product } from '../models/product.model';
import { Store } from './store.model';
import { User } from './user';

export interface Sale {
  id: number;
  product: Product;
  store: Store;
  user: User;
  quantity: number;
  subtotal: number;
  tax: number;
  total: number;
  created_at: string;
}

export interface SaleCreate {
  product_id: number;
  store_id: number;
  quantity: number;
}

