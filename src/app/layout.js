import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MultiPlay",
  description: "MultiPlay Play And Increase Multiple WatchTime On Youtube with Proxy Enabled ",
  verification:{
    "google-site-verification":"bZDeRwawe5fmMmr95BSzdsyEP1AQDOYyCRkg54EJ2eo"
  }
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
