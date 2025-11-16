import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flex Living Reviews Dashboard",
  description: "Manage and publish reviews from Hostaway and Google",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white">
            <div className="container-responsive py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-primary-500" />
                <span className="font-semibold">Flex Living Reviews</span>
              </Link>
              <nav className="text-sm text-gray-600 flex gap-4">
                <Link href="/dashboard" className="hover:text-gray-900">
                  Dashboard
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-white text-xs text-gray-500">
            <div className="container-responsive py-4">
              © {new Date().getFullYear()} Flex Living
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
