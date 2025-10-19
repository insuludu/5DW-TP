'use client';

import Footer from "../components/footer";
import Header from "../components/header";
import ProductForm from "./form";
import { useSearchParams } from 'next/navigation';

export default function Home() {

  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";

  return (
    <section>
      <Header />
      <div className="">
        <ProductForm id={id} />
      </div>
      <Footer />
    </section>
  );
}