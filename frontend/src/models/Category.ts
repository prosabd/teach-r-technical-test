import Produit from './Product';

export default interface Category {
    id: number;
    name: string;
    description?: string;
    produits?: Produit[];
}