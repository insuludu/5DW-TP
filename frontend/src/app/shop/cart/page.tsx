
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import ListCart from "./list-cart";


export default async function Page() {

    return (
        <div>
            <Header />
            <ListCart />
            <Footer />
        </div>
    )
}