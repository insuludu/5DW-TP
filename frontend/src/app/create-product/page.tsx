'use client';

import Footer from "../components/footer";
import Header from "../components/header";
import PasswordPopup from "../components/adminlogin";
import ProductForm from "./form";

import React, { useState } from 'react';

export default function Home() {
  const [open, setOpen] = useState(true); // show popup on page load (or false to control later)
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

      {/* Only show form if authenticated */}
      <div>
        {authenticated ? (
          <ProductForm />
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
