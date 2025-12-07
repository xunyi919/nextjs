'use client'

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllTags, getAllCategories } from "@/lib/supabase/helpers";

// 定义分类/标签类型
interface Category {
  name: string;
  num: number;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 优先获取分类，如果没有则获取标签
        let allCategories = await getAllCategories();
        if (!allCategories || allCategories.length === 0) {
          // 如果没有分类，尝试获取标签作为备用
          const tags = await getAllTags();
          allCategories = tags.map((tag: { name: string; num: number }) => ({ name: tag.name, num: tag.num }));
        }
        setCategories(allCategories);
      } catch (error) {
        console.error("获取分类列表失败:", error);
        // 如果获取分类失败，尝试获取标签
        try {
          const tags = await getAllTags();
          setCategories(tags.map((tag: { name: string; num: number }) => ({ name: tag.name, num: tag.num })));
        } catch (tagError) {
          console.error("获取标签列表也失败:", tagError);
          // 如果获取标签也失败，尝试从 getAllTags 获取
          try {
            const tags = await getAllTags();
            setCategories(tags.map((tag: { name: string; num: number }) => ({ name: tag.name, num: tag.num })));
          } catch (finalError) {
            console.error("最终获取失败:", finalError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 为不同的标签生成不同的颜色
  const getTagColor = (index: number) => {
    const colors = [
      "from-blue-400 to-purple-500",
      "from-green-400 to-blue-500",
      "from-yellow-400 to-orange-500",
      "from-pink-400 to-red-500",
      "from-indigo-400 to-purple-500",
      "from-teal-400 to-green-500"
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 md:py-16 decorative-bg min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* 头部区域 */}
        <div className="text-center mb-16 slide-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            文章分类
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            探索不同主题的内容，发现您感兴趣的文章
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mt-6 rounded-full"></div>
        </div>
        
        {categories.length === 0 ? (
          <div className="text-center py-20 glass-card slide-up">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">暂无分类</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">还没有创建任何分类。</p>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <Link 
                href={`/categories/${encodeURIComponent(category.name)}`}
                key={category.name}
                className="group"
              >
                <Card 
                  className="card-float p-8 flex flex-col items-center justify-center text-center glass-card border-0 h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getTagColor(index)} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-gray-600 dark:text-white text-3xl font-bold">{category.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {category.name}
                  </h3>  
                  <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                    共 <span className="text-indigo-600 dark:text-indigo-400 font-bold">{category.num}</span> 篇文章
                  </p>
                  <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-semibold transition-all duration-300 group-hover:gap-2 gap-1">
                    浏览分类
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoriesPage;