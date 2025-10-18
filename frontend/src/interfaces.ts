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
    Name: string;
    Description: string;
    Price: number;
    DiscountPrice?: number | null;
    UnitsInStock: number;
    Categories: string[];
    Status: number;
    ImagesData?: ImageDTO[] | null;
}
interface CreateProductImageDTO {
    Order: number;
    ImageData: number[]; // byte array as number array for JSON
}

export interface CategoryDTO {
    id: number,
    name: string;
}