import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import OrderList from "./order-list";

export default async function Page() {
    return (
        <div>
            <Header />
            <OrderList />
            <Footer />
        </div>
    );
}