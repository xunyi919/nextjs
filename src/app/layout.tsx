import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Layout from "@/components/layout";
import { Web3Providers } from "@/components/web3-provider";

export const metadata: Metadata = {
  title: "现代化博客系统",
  description: "一个现代化的博客平台，让您轻松分享知识和想法",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          <Web3Providers>
            <Layout>
              {children}
            </Layout>
          </Web3Providers>
        </AuthProvider>
      </body>
    </html>
  );
}