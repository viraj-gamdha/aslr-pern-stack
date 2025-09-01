import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";
import { Toaster } from "react-hot-toast";
import PersistAuth from "@/providers/PersistAuth";
import StoreProvider from "@/providers/StoreProvider";

const inter = Inter({
  variable: "--font-1",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DOSLR | Do systematic literature review",
  description: "DOSLR | Do systematic literature review",
};

// Like main.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
        <body className={`${inter.variable}`}>
          <Toaster position="bottom-right" />
          <PersistAuth>{children}</PersistAuth>
        </body>
      </StoreProvider>
    </html>
  );
}
