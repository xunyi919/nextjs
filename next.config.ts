import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 添加安全相关的配置
  poweredByHeader: false, // 要禁用 X-Powered-By 头部
  
  // 确保在生产环境中启用严格的安全措施
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
  
  // 添加安全头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          }
        ],
      },
    ];
  },
  
  // 确保使用最新的 Next.js 特性
  experimental: {
    optimizeCss: true,
  }
};

export default nextConfig;