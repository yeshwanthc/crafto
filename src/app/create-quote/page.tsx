"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Header from "@/components/Header";

const CreateQuote = () => {
  const [text, setText] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; message: string | null }>({ type: null, message: null });

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://crafto.app/crafto/v1.0/media/assignment/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Full upload response:", data);

    const mediaUrl = Array.isArray(data) && data[0]?.url ? data[0].url : null;

    if (!mediaUrl) {
      console.error("Error: mediaUrl missing from response:", data);
      throw new Error("No mediaUrl returned from upload. Please try again or contact support.");
    }

    return mediaUrl;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {

      setPreviewUrl(URL.createObjectURL(selectedFile));

      try {
        const url = await uploadFile(selectedFile);
        setMediaUrl(url);
        setStatus({ type: 'success', message: "Image uploaded successfully!" });
      } catch (error) {
        setStatus({ type: 'error', message: error instanceof Error ? error.message : "Failed to upload image." });
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: null });

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in again.");

      const response = await fetch("https://assignment.stage.crafto.app/postQuote", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, mediaUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to create quote: ${errorData.message || response.statusText}`);
      }

      setStatus({ type: 'success', message: "Quote created successfully!" });
      setText("");
   
      setPreviewUrl("");
      setMediaUrl("");
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
  
    <div className="max-w-2xl mt-20 lg:mt-30 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Quote</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            Quote Text
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            rows={4}
            placeholder="Enter your quote here..."
          />
        </div>
        <div>
          <label htmlFor="mediaFile" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image (optional)
          </label>
          <input
            type="file"
            id="mediaFile"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
            <div className="relative h-48 w-full">
              <Image
                src={previewUrl}
                alt="Quote media preview"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Creating..." : "Create Quote"}
        </button>
      </form>
      {status.type && (
        <div className={`mt-4 p-3 border rounded ${
          status.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'
        }`}>
          {status.type === 'error' ? 'Error: ' : ''}{status.message}
        </div>
      )}
    </div>
    </>
  );
};

export default CreateQuote;
