import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MassageNOW | Super Admin",
  description: "Secure data vault for MassageNOW management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=ABeeZee&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-abeezee bg-creamWhite min-h-screen">
        {children}
      </body>
    </html>
  );
}
