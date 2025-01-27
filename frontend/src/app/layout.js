import { Geist, Geist_Mono, Abril_Fatface, Agbalumo } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const abrilFatface = Abril_Fatface({
  subsets: ['latin'], // Choose subsets based on your project
  weight: '400', // Customize weights if needed
  variable: '--font-abril'
});

const agbalumo = Agbalumo({
  subsets: ['latin'], // Specify subsets as needed
  weight: '400', // Choose font weights as applicable
  variable: '--font-agbalumo'
});

export const metadata = {
  title: "Lyaim Tech Fantasy",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${abrilFatface.variable} ${agbalumo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
