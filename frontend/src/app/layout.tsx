"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import SideBar from "../components/sidebar";

const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "Your Website",
  description: "Your website description",
  openGraph: {
    title: "Your Website",
    description: "Your website description",
    siteName: "Your Website",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/browser-client-icon.ico" />
      </head>
      <body
        className={cn(
          inter.className,
          "antialiased overflow-hidden min-h-screen"
        )}
      >
          <div className="flex flex-row h-screen">
            <SideBar />{" "}
            <div className="ml-[240px] h-full overflow-y-auto flex-grow">
              {children}
            </div>
          </div>
          <Toaster
            toastOptions={{
              classNames: {
                toast: "bg-white",
                title: "text-black",
                description: "text-red-400",
                actionButton: "bg-indigo-400",
                cancelButton: "bg-orange-400",
                closeButton: "bg-white-400",
              },
            }}
          />
      </body>
    </html>
  );
}
