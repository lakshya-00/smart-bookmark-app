'use client';

import "@/styles/globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <html lang="en">
      <head>
        <title>Smart Bookmark App</title>
        <meta
          name="description"
          content="A simple, fast, and secure bookmark manager"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-zinc-950 min-h-screen">
        <Navbar />
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
