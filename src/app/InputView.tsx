"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function InputView({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [input, setInput] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 flex flex-col items-center w-full max-w-md border border-white/20"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
        >
          Enter a Name or Phrase
        </motion.h1>
        <motion.input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type here..."
          className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4 text-lg shadow-sm"
          whileFocus={{ scale: 1.03, boxShadow: "0 0 0 2px #60a5fa" }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition shadow-md mt-2"
          onClick={() => input.trim() && onSubmit(input.trim())}
        >
          Submit
        </motion.button>
      </motion.div>
    </div>
  );
} 