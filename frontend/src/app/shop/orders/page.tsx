import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import OrderList from "./order-list";
import OrderSingle from "./order-single";

export default function Page({ searchParams }: { searchParams: { ordernumber?: string } }) {
    const orderNumber = searchParams?.ordernumber;

    return (
        <div>
            <Header />
            {orderNumber ? <OrderSingle orderNumber={orderNumber} /> : <OrderList />}
            <Footer />
        </div>
    );
}
