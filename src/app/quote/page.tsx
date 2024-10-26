'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";

interface Quote {
  id: number;
  username: string;
  text: string;
  mediaUrl: string | null;
  createdAt: string;
}

const QuoteComponent = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchQuotes = async () => {
    try {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `https://assignment.stage.crafto.app/getQuotes?limit=10&offset=${page * 10}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "Invalid token") {
          setError("Invalid token. Redirecting to login.");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setError("Error fetching quotes");
        }
        return;
      }

      const data = await response.json();

      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setQuotes((prevQuotes) => [...prevQuotes, ...data.data]);
      }
    } catch (error) {
      setError("Error fetching quotes");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMore) fetchQuotes();
  }, [page]);

  useEffect(() => {
    const filtered = quotes.filter(
      (quote) =>
        quote.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuotes(filtered);
  }, [quotes, searchTerm]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }
console.log(quotes)
  return (
    <>
      <Header />
      <div className="mt-10 relative">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Quotes
          </h1>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search quotes"
            />
          </div>
          {loading && filteredQuotes.length === 0 ? (
            <QuoteSkeleton />
          ) : filteredQuotes.length === 0 ? (
            <p className="text-center text-gray-600">No quotes available.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuotes.map((quote, i) => (
                  <QuoteCard key={i} quote={quote} />
                ))}
              </div>
              {(loading && <QuoteSkeleton />) || (hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-105"
              >
                Load More
              </button>
            </div>
          ))}
            </>
          )}
        </div>
        <button
          onClick={() => router.push("/create-quote")}
          className="fixed bottom-8 right-8 bg-blue-600 text-white text-2xl font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
          aria-label="Create Quote"
        >
          +
        </button>
      </div>
    </>
  );
};

const QuoteCard = ({ quote }: { quote: Quote }) => (
  <div className="bg-white p-4 rounded-lg border shadow-md transition duration-300 ease-in-out hover:shadow-lg flex flex-col justify-between relative">
    {quote.mediaUrl ? (
      <div className="relative">
        <img
          src={quote.mediaUrl}
          alt="Quote media"
          className="quote-image rounded-md w-full h-40 object-cover"
        />
        <p className="absolute text-white inset-0 flex items-center justify-center text-lg font-semibold bg-black bg-opacity-50 p-4 rounded-md">
          &quot;{quote.text}&quot;
        </p>
      </div>
    ) : (
      <p className="relative text-black inset-0 text-lg font-semibold">
        &quot;{quote.text}&quot;
      </p>
    )}
    <div className="mt-5 flex justify-between">
      <p className="text-xs text-gray-500 mt-2">
        Created at: {new Date(quote.createdAt).toLocaleDateString()}
      </p>
      <p className="text-right text-sm text-gray-600">- {quote.username}</p>
    </div>
  </div>
);

const QuoteSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-40 bg-gray-200 rounded mt-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
      </div>
    ))}
  </div>
);

export default QuoteComponent;
