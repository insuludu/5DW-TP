import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import CheckoutFlow from "./checkout-flow";

export default function CheckoutPage() {
    return (
        <div>
            <Header />
            <CheckoutFlow />
            <Footer />
        </div>
    );
}