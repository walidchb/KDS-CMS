"use client";
import { Suspense } from "react";
import ImagesContent from "@/components/ImagesContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div></div>}>
      <ImagesContent />
    </Suspense>
  );
}
