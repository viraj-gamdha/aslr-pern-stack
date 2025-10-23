import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";
import { Toaster } from "react-hot-toast";
import PersistAuth from "@/providers/PersistAuth";
import StoreProvider from "@/providers/StoreProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({
  variable: "--font-1",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "aSLR | Systematic literature review Bot",
  description: "aSLR | Systematic literature review Bot",
};

// Like main.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
        <StoreProvider>
          <body className={`${inter.variable}`}>
            <Toaster position="bottom-right" />
            <PersistAuth>{children}</PersistAuth>
          </body>
        </StoreProvider>
      </ThemeProvider>
    </html>
  );
}
