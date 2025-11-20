import CartCard from "./cart-card";

export default async function ListCart() {
    const cartProducts: CartProductDTO[] = [
        {
            id: 1,
            name: "Product A",
            price: 29.99,
            discountedPrice: 19.99,
            status: 1,
            imagesData: null,
            amount: 1,
            selected: true,
        },
        {
            id: 2,
            name: "Product B",
            price: 14.99,
            discountedPrice: null,
            status: 1,
            imagesData: null,
            amount: 2,
            selected: false,
        },
        {
            id: 3,
            name: "Product C",
            price: 59.99,
            discountedPrice: 49.99,
            status: 1,
            imagesData: null,
            amount: 1,
            selected: true,
        },
    ];

    return (
        <div className={`m-5 `}>
            <h1>Panier</h1>
            {cartProducts.map(product => (
                <CartCard key={product.id} product={product} />
            ))}
        </div>
    )
}