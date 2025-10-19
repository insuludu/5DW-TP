'use client';

import Footer from "../components/footer";
import Header from "../components/header";
import PasswordPopup from "../components/adminlogin";
import ProductForm from "./form";
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function Home() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";

  const [open, setOpen] = useState(true); // show popup initially
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <section>
      <Header />

      {/* Password popup */}
      <PasswordPopup
        show={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setAuthenticated(true);
          setOpen(false);
        }}
      />

      {/* Content shown only if authenticated */}
      <div>
        {authenticated ? (
          <ProductForm id={id} />
        ) : (
          <div className="flex h-64 items-center justify-center text-gray-600">
            Accès restreint - veuillez entrer le mot de passe.
          </div>
        )}
      </div>

      <Footer />
    </section>
  );
}
