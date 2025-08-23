"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoKdsNavBarWeb from "../assets/svg/LogoKdsNavBarWeb.svg";

export default function Home() {
  const Router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      Router.replace(`/login`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [Router]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen px-8 pb-20 pt-16 gap-12 sm:px-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      {/* KDS Logo */}
      <LogoKdsNavBarWeb />

      {/* Animated Spinner and Text */}
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-16 h-16 border-4 border-red-700 border-dashed rounded-full animate-spin"></div>
        <p className="mt-6 text-gray-500 text-xl font-semibold">
          Kreative Diagnostic System
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Chargement, veuillez patienter...
        </p>
      </div>

      {/* Footer */}
      <footer className="text-gray-300 text-xs animate-fade-in">
        &copy; {new Date().getFullYear()} KDS - All Rights Reserved
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
