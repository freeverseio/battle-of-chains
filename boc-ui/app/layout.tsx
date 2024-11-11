import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import localFont from "next/font/local";
const myFont = localFont({
  src: [
    {
      path: "./fonts/Pixelade.ttf",
    },
  ],
  variable: "--font-pixelade",
});

export const metadata: Metadata = {
  title: "Battle of Chains",
  description: "A Fully Decentralized Multichain Strategy Game",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={myFont.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
