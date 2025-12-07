'use client'
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getAllPosts } from "@/lib/supabase/helpers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 定义文章类型
interface Post {
  id: number | string; // 支持数字ID或UUID字符串
  title: string;
  content: string;
  tag: string;
  category?: string;
  author_id: number | string;
  slug: string;
  published: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("获取文章列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 md:py-16 decorative-bg relative z-10">
      {/* 英雄区域 */}
      <section className="relative mb-20 md:mb-24 fade-in">
        <div className="max-w-7xl mx-auto">
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
                  <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">欢迎来到</span>
                  <span className="block mt-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    博客世界
                  </span>
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-12 opacity-95 leading-relaxed text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  在这里分享您的知识、经验和见解，与全世界交流思想
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
                  <Button 
                    asChild
                    className="bg-white text-indigo-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    <Link href="/write">开始创作</Link>
                  </Button>
                  <Button 
                    asChild
                    className="bg-white text-indigo-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      {/* variant="outline" */}
                    {/* className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105" */}
                    <Link href="/categories">浏览分类</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 slide-up">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
              最新文章
            </h2>
            <p className="text-gray-600 dark:text-gray-400">发现最新的内容和见解</p>
          </div>
          <Link 
            href="/categories" 
            className="mt-4 sm:mt-0 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center transition-all duration-300 group"
          >
            查看所有分类
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 glass-card slide-up">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">暂无文章</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">还没有文章，敬请期待！</p>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                className="group slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="card-float h-full overflow-hidden rounded-2xl glass-card border-0">
                  <div className="p-6 md:p-8">
                    <Link href={`/posts/${encodeURIComponent(post.id)}`}>
                      <h3 className="text-xl md:text-2xl font-bold mb-4 text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2 cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-800 dark:text-gray-400 line-clamp-3 mb-6 leading-relaxed">{post.content}</p>
                    
                    {/* 分类和标签显示 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.category && post.category.split(',').map((cat, catIndex) => (
                        <Link
                          key={catIndex}
                          href={`/categories/${encodeURIComponent(cat.trim())}`}
                          className="inline-block bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors duration-300"
                        >
                          📁 {cat.trim()}
                        </Link>
                      ))}
                      {post.tag && post.tag.split(',').map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/50"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {new Date(post.created_at).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <Link 
                        href={`/posts/${encodeURIComponent(post.id)}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-semibold transition-all duration-300 flex items-center group-hover:gap-2 gap-1"
                      >
                        阅读更多
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform text-indigo-600 dark:text-indigo-400 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}