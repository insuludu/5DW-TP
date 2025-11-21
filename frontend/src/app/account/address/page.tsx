import Header from "@/app/components/header"
import "@/app/account/signup/form"
import AddressForm from "@/app/account/address/form";

export default function Address()
{
    return (
        <section>
            <Header/>
            <AddressForm/>
        </section>
    );
}