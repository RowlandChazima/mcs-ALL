import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Maths & CS Cohort Hub",
  description:
    "Curated lecture notes, video guides, tutorial sheets, and past papers for Mathematics and Computer Science.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-canvas text-ink flex flex-col antialiased selection:bg-coral selection:text-white">
        {/*  Layout Wrapper:  */}
        <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navbar */}
          <Navbar />

          {/* Main content viewport stretches to push footer down */}
          <main className="flex-1 w-full py-6 md:py-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
