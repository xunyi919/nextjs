"use client";

import Header from "@/components/header";
import { ReactNode } from "react";

import Footer from "@/components/footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}