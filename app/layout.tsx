import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { DataProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "CredMalawi — National Digital Credentialing",
  description:
    "Malawi's national digital credentialing platform for the ICT sector. Verifiable digital badges issued by ICTAM-accredited training providers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
