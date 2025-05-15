export interface IProduct {
  _id: string;
  __v: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  freeShipping: boolean;
  image: string | null;
  price: number;
  quantity: number;
  sellerId: string;
}
