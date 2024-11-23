import type { Metadata } from "next";
import "./globals.css";
import {Poppins} from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400','500','600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "Evently",
  description: "Evently a platform for event management.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={poppins.variable}
        >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}