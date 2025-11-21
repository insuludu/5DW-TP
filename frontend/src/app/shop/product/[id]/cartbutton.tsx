'use client';
/*
    a cause que react c'est de la merde je n'ai pas le choix que d'ajouter
    un component pour 1 seul bouton puisque je ne peut pas utiliser de onclick dans des function async
*/
export default function AddToCartButton({ productId }: { productId: number }) {
    const handleClick = async () => {
        const formData = new FormData();
        formData.append('id', productId.toString());

        try {
            const response = await fetch('/api/shop/cart/add-product', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
            } else {
                console.error('Error adding to cart:', data.error);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <button 
            onClick={handleClick} 
            className="btn btn-danger btn-lg w-100"
        >
            Ajouter au panier
        </button>
    );
}