"use client";
import AnimatedView from "../AnimatedView";
import { useEffect, useState } from "react";

export default function View2Page() {
  const [texts, setTexts] = useState<string[]>(["SPLMNS"]); // Initialize with default text

  useEffect(() => {
    try {
      // Read texts from localStorage
      const storedTexts = JSON.parse(localStorage.getItem('animatedTexts') || '[]');
      console.log('View2 - Retrieved texts:', storedTexts); // Debug log
      if (Array.isArray(storedTexts) && storedTexts.length > 0) {
        setTexts(storedTexts);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, []);

  return <AnimatedView onBack={() => window.location.href = "/"} initialTexts={texts} />;
} 