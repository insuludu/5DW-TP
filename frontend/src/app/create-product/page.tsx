"use client";

import Footer from "../components/footer";
import Header from "../components/header";
import ProductForm from "./form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roles, setRoles] = useState<string[] | null>(null); 
  const router = useRouter();

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });

        if (!res.ok) {
          console.error("API /me failed");
          return setRoles([]);
        }

        const data = await res.json();

        setRoles(data.roles || []);
      } catch (err) {
        console.error("Error fetching /api/auth/me:", err);
        setRoles([]);
      }
    }

    fetchRoles();
  }, []);

  // When roles are received, check access
  useEffect(() => {
    if (roles === null) return; // still loading

    if (!roles.includes("Admin")) {
      router.push("/error");
    }
  }, [roles, router]);

  // Optional loading UI
  if (roles === null || !roles.includes("Admin")) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <Header />
      <div>
        <ProductForm />
      </div>
      <Footer />
    </section>
  );
}
