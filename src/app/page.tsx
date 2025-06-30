"use client";
import { useState } from "react";
import InputView from "./InputView";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  // Remove AnimatedView logic, just show InputView
  return (
    <InputView
      onSubmit={(text: string) => {
        // Store the text in localStorage
        const existingTexts = JSON.parse(localStorage.getItem('animatedTexts') || '[]');
        const newTexts = [...existingTexts, text].slice(-5); // Keep only last 5 texts
        localStorage.setItem('animatedTexts', JSON.stringify(newTexts));
        console.log('View1 - Stored texts:', newTexts); // Debug log
        router.push("/view2");
      }}
          />
  );
}
