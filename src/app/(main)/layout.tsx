import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import MenuBar from "@/components/Layout/Menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expence Tracker",
  description: "An app that helps you to manage and track your expences",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-[100vh] w-[100vw] flex flex-col lg:flex-row lg:gap-8 bg-surface lg:bg-background">
        <MenuBar />
        <div className="flex flex-col flex-1 lg:h-full lg:overflow-y-auto">
        {children}
        </div>
      </body>
    </html>
  );
}
