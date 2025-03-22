"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const Router = useRouter();

  useEffect(() => {
    Router.replace(`/cms`);
  }, []);

  return <div>loaddin ....</div>;
}
