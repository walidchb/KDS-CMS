"use client";
import { Suspense } from "react";
import ProductsContent from "@/components/ProductsContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
