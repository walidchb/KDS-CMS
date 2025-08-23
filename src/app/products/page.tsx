"use client";
import { Suspense } from "react";
import ProductsContent from "@/components/ProductsContent";
// import { useRouter } from "next/navigation";

export default function ProductsPage() {
  // const router = useRouter();

  return (
    <Suspense fallback={<div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
