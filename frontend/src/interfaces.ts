export interface ImageDTO {
    id: number; 
    url: string;
    alt: string;
    order: number;
}

export interface StarProductDTO {
    id: number;
    name: string;
    imageData?: ImageDTO | null; 
}

export interface ShopProductDTO {
    id: number;
    name: string;
    price: number;
    discountedPrice?: number | null;
    status: number;
    categories: CategoryDTO[];
    imagesData?: ImageDTO[] | null; 
}

export interface CreateProductDTO{
    nom: string;
    description: string;
    prix: Float64Array;
}

export interface CategoryDTO {
    id: number,
    name: string;
}