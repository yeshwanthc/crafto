"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br flex flex-col justify-center items-center px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-black mb-6">
            Welcome to Crafto
          </h1>
          <p className="text-xl text-black mb-8">
            Discover and share inspiring quotes.
          </p>
          <Link
            href="/quote"
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            View Quotes
          </Link>
        </div>
      </div>
    </>
  );
}