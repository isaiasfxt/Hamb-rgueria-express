/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Burger Clássico',
    description: 'Pão brioche, blend bovino 150g, queijo cheddar, alface, tomate e maionese da casa.',
    price: 25.90,
    category: 'Tradicional',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    sizes: ['Simples', 'Duplo', 'Triplo'],
    extras: [
      { name: 'Bacon', price: 4.50 },
      { name: 'Queijo Extra', price: 3.50 },
      { name: 'Ovo', price: 2.50 }
    ]
  },
  {
    id: '2',
    name: 'Bacon Heaven',
    description: 'Muito bacon crocante, blend bovino 150g, cheddar duplo e molho barbecue.',
    price: 32.90,
    category: 'Especial',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=800&auto=format&fit=crop',
    sizes: ['Simples', 'Duplo'],
    extras: [
      { name: 'Cheddar Extra', price: 4.00 },
      { name: 'Picles', price: 2.00 }
    ]
  },
  {
    id: '3',
    name: 'Combo Família',
    description: '2 Burgers Clássicos + 1 Porção de Batata G + 2 Refrigerantes 350ml.',
    price: 69.90,
    category: 'Combo',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Coca-Cola 350ml',
    description: 'Refrigerante em lata gelado.',
    price: 6.00,
    category: 'Bebida',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Suco Natural',
    description: 'Suco de laranja natural e gelado 500ml.',
    price: 10.00,
    category: 'Bebida',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&auto=format&fit=crop',
  }
];

export const WHATSAPP_NUMBER = '5511999999999'; // Número fictício para exemplo
