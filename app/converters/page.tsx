"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Upload, Download } from "lucide-react";

const converters = [
  {
    title: "Image to PDF",
    href: "/converters/image-to-pdf",
    icon: "/icons/image-to-pdf.svg",
    primaryColor: "#0056D2",
    secondaryColor: "#E3ECFF",
  },
  {
    title: "PDF to Image",
    href: "/converters/pdf-to-image",
    icon: "/icons/pdf-to-image.svg",
    primaryColor: "#D23B00",
    secondaryColor: "#FFE3E3",
  },
  {
    title: "Word to PDF",
    href: "/converters/word-to-pdf",
    icon: "/icons/word-to-pdf.svg",
    primaryColor: "#00875A",
    secondaryColor: "#E3FFF1",
  },
  {
    title: "Excel to PDF",
    href: "/converters/excel-to-pdf",
    icon: "/icons/excel-to-pdf.svg",
    primaryColor: "#007B3E",
    secondaryColor: "#E3FFF1",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] text-black flex flex-col items-center p-6">
      <motion.h1
        className="text-5xl font-extrabold mb-8 text-[#0056D2]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Online File Converters
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {converters.map((converter, index) => (
          <Link key={index} href={converter.href}>
            <motion.div
              className="p-6 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer shadow-xl border border-gray-300 hover:shadow-2xl transition-transform transform hover:scale-105"
              style={{
                backgroundColor: converter.secondaryColor,
                borderColor: converter.primaryColor,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <img
                src={converter.icon}
                alt={converter.title}
                className="w-12 h-12"
              />
              <span
                className="text-xl font-semibold"
                style={{ color: converter.primaryColor }}
              >
                {converter.title}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
