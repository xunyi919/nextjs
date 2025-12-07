'use client'

import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen decorative-bg py-12 md:py-16 relative z-10">
      {/* 英雄区域 */}
      <section className="relative mb-20 md:mb-24 fade-in">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-1 shadow-2xl">
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-16 lg:p-20 text-white">
              {/* 背景装饰 */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  关于我们
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto opacity-95 leading-relaxed">
                  这是一个现代化的博客平台，让每个人都能轻松分享知识和想法
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 简介内容 */}
      <section className="section-padding">
        <div className="container-max px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-12 mb-16 slide-up">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">平台简介</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
              </div>
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-gray-700 dark:text-gray-300">
                  我们的博客平台基于最新的技术栈构建，提供流畅的写作和阅读体验。
                  无论你是技术专家、内容创作者还是普通读者，都能在这里找到属于自己的空间。
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  我们致力于打造一个开放、包容的知识分享社区，让知识传播变得更加简单和高效。
                  通过现代化的界面设计和强大的功能，我们希望能够激发每个人的创作灵感。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="glass-card p-8 rounded-2xl text-center slide-up group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  简单易用
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  直观的界面设计，让创作变得轻松简单
                </p>
              </div>
              
              <div className="glass-card p-8 rounded-2xl text-center slide-up group hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  功能强大
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  丰富的编辑功能和个性化设置选项
                </p>
              </div>
              
              <div className="glass-card p-8 rounded-2xl text-center slide-up group hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  社区互动
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  与全球创作者和读者建立连接
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 联系信息 */}
      <section className="section-padding bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container-max px-4">
          <div className="max-w-3xl mx-auto text-center slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">联系我们</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
              如果您有任何问题或建议，欢迎随时与我们联系
            </p>
            <div className="glass-card p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Link 
                    href="mailto:contact@example.com" 
                    className="text-lg text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                  >
                    contact@example.com
                  </Link>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <Link 
                    href="https://github.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                  >
                    项目地址
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}