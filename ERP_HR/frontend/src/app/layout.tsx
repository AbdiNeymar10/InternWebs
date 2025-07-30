import "./styles/globals.css";
//import { Inter } from "next/font/google";

//const inter = Inter({ subsets: ["latin"] });
//<body className={`${inter.className} bg-gray-100`}>{children}</body>

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}

// src/app/layout.js
