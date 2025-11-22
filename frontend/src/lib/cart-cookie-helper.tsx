export interface CartCookieItem {
    id: number;
    amount: number;
}

export class CartCookieHelper {
    
    static parseCart(cookieValue: string | undefined): CartCookieItem[] {
        if (!cookieValue) return [];
        try {
            const parsed = JSON.parse(cookieValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
                if (typeof parsed[0] === 'number') {
                    return parsed.map(id => ({ id, amount: 1 }));
                }
                return parsed;
            }
            return [];
        } catch {
            return [];
        }
    }

    static addProduct(cart: CartCookieItem[], productId: number, amount: number = 1): CartCookieItem[] {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            return cart.map(item => 
                item.id === productId 
                    ? { ...item, amount: item.amount + amount }
                    : item
            );
        } else {
            return [...cart, { id: productId, amount }];
        }
    }

    static updateQuantity(cart: CartCookieItem[], productId: number, newAmount: number): CartCookieItem[] {
        if (newAmount <= 0) {
            return cart.filter(item => item.id !== productId);
        }
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            return cart.map(item =>
                item.id === productId
                    ? { ...item, amount: newAmount }
                    : item
            );
        }
        return [...cart, { id: productId, amount: newAmount }];
    }

    static removeProduct(cart: CartCookieItem[], productId: number): CartCookieItem[] {
        return cart.filter(item => item.id !== productId);
    }

    static getProductIds(cart: CartCookieItem[]): number[] {
        return cart.map(item => item.id);
    }

    static getProductAmount(cart: CartCookieItem[], productId: number): number {
        return cart.find(item => item.id === productId)?.amount ?? 0;
    }

    static isEmpty(cart: CartCookieItem[]): boolean {
        return cart.length === 0;
    }

    static getTotalItems(cart: CartCookieItem[]): number {
        return cart.reduce((total, item) => total + item.amount, 0);
    }

    static serialize(cart: CartCookieItem[]): string {
        return JSON.stringify(cart);
    }
}