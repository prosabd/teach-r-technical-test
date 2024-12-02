import Category from './Category';

export default interface Product {
    id: number;
    nom: string;
    description?: string;
    prix: number;
    dateCreation: Date;
    categorie: Category;
}