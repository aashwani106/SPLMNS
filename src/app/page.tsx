"use client";
import InputView from "./InputView";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0a0e1a] relative overflow-hidden">
      {/* Dotted background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-dot-pattern" />
      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-1 z-10 relative py-12">
        <Image src="/globe.svg" alt="Logo" width={80} height={80} className="mb-4 drop-shadow-lg animate-spin-slow" />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-xl tracking-tight text-center leading-tight"
        >
          Welcome to SPLMNS<br />
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-2xl md:text-3xl font-semibold mt-2"
          >
            See Your Name Animated in 3D!
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          className="text-lg md:text-xl text-blue-100 mb-8 text-center max-w-xl mt-2"
        >
          Enter a name or phrase and see it come alive in a beautiful 3D room!
        </motion.p>
        <div className="w-full max-w-md">
          <InputView
            onSubmit={(text: string) => {
              const existingTexts = JSON.parse(localStorage.getItem('animatedTexts') || '[]');
              const newTexts = [...existingTexts, text].slice(-5);
              localStorage.setItem('animatedTexts', JSON.stringify(newTexts));
              console.log('View1 - Stored texts:', newTexts);
              router.push("/view2");
            }}
          />
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full text-center py-4 text-blue-200 text-sm z-10 relative bg-transparent no-glow-footer">
        © {new Date().getFullYear()} SPLMNS &mdash; Crafted by Ashwani
      </footer>
    </div>
  );
}
