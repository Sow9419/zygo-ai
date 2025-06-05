import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changed font to Inter as per prompt's target
import "./globals.css";
import { AppProviders } from "./providers"; // Import the new providers component
import { Toaster } from "@/components/ui/sonner"; // Assuming Toaster is for global notifications

const inter = Inter({ subsets: ["latin"] }); // Changed font to Inter

export const metadata: Metadata = {
  title: "Zygo Search", // Example title from prompt
  description: "Next Generation Search Experience", // Example description from prompt
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr"> {/* Removed suppressHydrationWarning for now, can be added if needed */}
      <body className={inter.className}> {/* Used Inter font className */}
        <AppProviders> {/* Wrap children with AppProviders */}
          {/* The existing divs for layout structure should remain inside AppProviders if they are part of the content */}
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
          <Toaster /> {/* Toaster for notifications */}
        </AppProviders>
      </body>
    </html>
  );
}
