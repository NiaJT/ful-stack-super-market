export interface IProduct {
  _id: string;
  name: string;
  brand: string;
  category: string;
  shortDescription: string;
  image: string | undefined;
  price: number;
  quantity: number;
  sellerId: string;
}
