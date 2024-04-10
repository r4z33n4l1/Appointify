import { Inter } from "next/font/google";

import { AuthProvider } from "@/utils/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Appointify",
  description: "Your favorite appointment scheduling app!",


};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
