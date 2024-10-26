"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";


export default function Home() {
  return (
    <>
       <Header />

    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Welcome to Crafto
        </h1>
        <p className="text-xl text-white mb-8">
          Discover and share inspiring quotes from around the world.
        </p>
        <Link
          href="/quote"
          className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          View Quotes
        </Link>
      </div>
    
    </div>
    </>
  );
}
