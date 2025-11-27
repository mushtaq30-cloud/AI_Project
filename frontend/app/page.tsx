"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function HomePage() {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/stream`;
    const evt = new EventSource(url);

    let buffer = "";

    evt.onmessage = (e) => {
      setIsLoading(false);
      buffer += e.data + "\n";
      setIdea(buffer);
    };

    evt.onerror = () => {
      console.error("SSE connection error. Closing stream.");
      setIsLoading(false);
      evt.close();
    };

    return () => evt.close();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-4">
              ✨ AI-Powered
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Business Ideas
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Instantly Generated</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Get innovative business ideas powered by AI. Explore new opportunities in seconds.
          </p>
        </header>

        {/* Content Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-600"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-indigo-500 animate-spin"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Generating brilliant ideas...</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Powered by OpenAI</p>
              </div>
            ) : (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {idea ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                    {idea}
                  </ReactMarkdown>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Unable to load ideas. Please try again.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-600 dark:text-gray-400 text-sm">
          <p>💡 Refresh to generate new ideas</p>
        </footer>
      </div>
    </main>
  );
}
