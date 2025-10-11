import Header from "../components/header";

export default function Page() {
    return(
        <div>
            <Header />
            <section className={`row mt-5 mb-5`}>
                <div className={`m-3`}>
                    <p className='fs-3'>Nos produits</p>
                </div>
            </section>
        </div>
    );
}