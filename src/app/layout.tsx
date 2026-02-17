'use client';

import "@/styles/globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

// This would be separate in a server component but we need client for auth
// export const metadata: Metadata = {
//   title: "Smart Bookmark App",
//   description: "A simple, fast, and secure bookmark manager",
// };

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
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
