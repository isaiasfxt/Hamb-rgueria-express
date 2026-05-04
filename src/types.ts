/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryType = 'Tradicional' | 'Especial' | 'Bebida' | 'Combo';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  image: string;
  sizes?: string[]; // Simple, Duplo, Triplo
  extras?: { name: string; price: number }[];
}

export interface CartItem {
  id: string; // unique for cart (product.id + selected extras/size)
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedExtras: { name: string; price: number }[];
  observations?: string;
  totalPrice: number;
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: 'Dinheiro' | 'Pix' | 'Cartão';
}
