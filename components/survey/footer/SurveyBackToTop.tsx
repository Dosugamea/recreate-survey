"use client";

import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export function SurveyBackToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showScrollTop) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-gray-700 hover:bg-gray-600 text-white rounded-md p-2 shadow-lg transition-all z-50"
      aria-label="ページトップへ戻る"
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
