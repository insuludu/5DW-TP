import Header from "../components/header";
import Catalog from "./catalog";

export default function Page() {
    return(
        <div>
            <Header />
            <section className={`row mt-5 mb-5`}>
                <div>
                    <p className='ms-5 fs-3'>Nos produits</p>
                    <Catalog />
                </div>
            </section>
        </div>
    );
}