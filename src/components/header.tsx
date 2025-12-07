"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Moon, Sun, Github } from "lucide-react"
import { useAuth } from "@/context/auth-context"

const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user, signInWithGithub, signOut } = useAuth();

  // 读取并初始化主题（仅在客户端）
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as "light" | "dark" | null;
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = stored || (prefersDark ? "dark" : "light");
      setTheme(initial);
    } catch (e) {
      // ignore
    }
  }, []);

  // 将主题写回到 html[data-theme] 并持久化
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
      }
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <Link 
          href="/" 
          className="text-xl md:text-2xl font-bold gradient-text hover:opacity-80 transition-opacity duration-300"
        >
          博客系统
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            href="/" 
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            首页
          </Link>
          <Link 
            href="/categories" 
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            分类
          </Link>
          <Link 
            href="/write" 
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            新文章
          </Link>
          <Link 
            href="/about" 
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            关于
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                {user.user_metadata.full_name || user.email?.split('@')[0]}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="btn-outline text-sm"
              >
                登出
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signInWithGithub}
              className="btn-outline text-sm flex items-center"
            >
              <Github className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">GitHub登录</span>
              <span className="sm:hidden">登录</span>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggle} 
            aria-pressed={theme === "dark"} 
            aria-label="Toggle color theme"
            className="btn-outline"
          >
            {theme === "dark" ?
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" /> :
              <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
            }
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;