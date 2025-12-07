"use client";

import Link from "next/link";
import { Github, Mail, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl py-12 md:py-16">
      <div className="container-max px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-4">博客系统</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
              一个现代化的博客平台，让您轻松分享知识和想法。使用最新的技术栈构建，提供流畅的写作和阅读体验。
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="mailto:contact@example.com"
                className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">导航</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                >
                  分类
                </Link>
              </li>
              <li>
                <Link 
                  href="/write" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                >
                  写文章
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                >
                  关于
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">支持</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/help" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                >
                  帮助中心
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                >
                  使用条款
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                >
                  隐私政策
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                >
                  联系我们
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200/50 dark:border-gray-800/50 mt-12 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} 博客系统. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
}