import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/utils/authContext";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>
        {/* <AuthProvider> */}
          {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
