"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

const CreateQuote = () => {
  const [quoteText, setQuoteText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; message: string | null }>({ type: null, message: null });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    console.log("Starting file upload...");
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch("https://crafto.app/crafto/v1.0/media/assignment/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        console.error("File upload failed:", response.status, response.statusText);
        throw new Error("Failed to upload file");
      }
  
      const data = await response.json();
      console.log("File upload response:", data);
      
      if (!data.mediaUrl) {
        console.error("No mediaUrl in upload response");
        throw new Error("No mediaUrl returned from upload");
      }
  
      return data.mediaUrl;
    } catch (error) {
      console.error("Error in file upload:", error);
      throw error;
    }
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: null });
  
    console.log("Submission started:", { quoteText, filePresent: !!file });
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
  
      console.log("Token retrieved from localStorage");
  
      let mediaUrl = "";
      if (file) {
        console.log("Uploading file...");
        mediaUrl = await uploadFile(file);
        console.log("File uploaded successfully, mediaUrl:", mediaUrl);
      }
  
      console.log("Sending quote creation request...");
      const response = await fetch("https://assignment.stage.crafto.app/postQuote", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: quoteText,
          mediaUrl: mediaUrl
        }),
      });
  
      if (!response.ok) {
        console.error("Quote creation failed:", response.status, response.statusText);
        throw new Error("Failed to create quote");
      }
  
      const responseData = await response.json();
      console.log("Quote created successfully, full response:", responseData);
  
      setStatus({ type: 'success', message: "Quote created successfully!" });
      setQuoteText("");
      setFile(null);
      setPreviewUrl("");
    } catch (err) {
      console.error("Error during submission:", err);
      setStatus({ 
        type: 'error', 
        message: err instanceof Error ? err.message : "An unexpected error occurred" 
      });
    } finally {
      setIsLoading(false);
      console.log("Submission process completed");
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Quote</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="quoteText" className="block text-sm font-medium text-gray-700 mb-1">
            Quote Text
          </label>
          <textarea
            id="quoteText"
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            rows={4}
            placeholder="Enter your quote here..."
          />
        </div>
        <div>
          <label htmlFor="mediaFile" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image
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
  );
};

export default CreateQuote;