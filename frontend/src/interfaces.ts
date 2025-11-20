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

export interface DetailProductDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    discountedPrice?: number | null;
    status: number;
    unitsInStock: number;
    categories: CategoryDTO[];
    imagesData?: ImageDTO[] | null; 
}

export interface CreateProductDTO{
    name: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    unitsInStock: number;
    categories: string[];
    status: number;
    imagesData?: ImageDTO[] | null;
}

export interface EditProductDTO{
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    unitsInStock: number;
    categories: string[];
    status: number;
    imagesData?: ImageFormDTO[] | null;
}

export interface ImageFormDTO{
    file?: File | null;
    image?: ImageDTO | null;
}

interface CreateProductImageDTO {
    Order: number;
    ImageData: number[]; // byte array as number array for JSON
}

export interface CategoryDTO {
    id: number,
    name: string;
}

export interface PaginatedResponse {
    products: ShopProductDTO[];
    currentPage: number;
    pageSize: number;
    totalProducts: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface IRegisterForm {
    FirstName : string;
    LastName : string;
    Email : string;
    Password : string;
    PasswordConfirm : string;
}

export interface IRegisterFormResponse {
    IsValid : boolean;
    Errors : string[];
}

export interface IAddress {
    StreetNumber : number;
    Appartement : string;
    StreetName : string;
    City : string;
    StateProvince : string;
    Country : string;
    PostalCode : string;
}
