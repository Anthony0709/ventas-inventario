

export interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
  store_id?: number; // Necesario para validar en el frontend la tienda del producto
}

export interface ProductCreate {
  name: string;
  price: number;
  stock?: number;
  store_id: number;
}
