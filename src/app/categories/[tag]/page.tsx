'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { getPostsByTag, getPostsByCategory, getPostsByCategoryEqual } from '@/lib/supabase/helpers';

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

const TagPostsPage = ({ params }: { params: Promise<{ tag: string }> }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagName, setTagName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 解析 params
        const resolvedParams = await params;
        
        // 对标签名称进行解码，解决URL编码问题
        const decodedTagName = decodeURIComponent(resolvedParams.tag);
        setTagName(decodedTagName);
        
        // 先尝试按分类精确匹配查询，如果失败则尝试按分类模糊查询，最后尝试按标签查询
        let tagPosts;
        try {
          // 首先尝试精确匹配 category 字段
          tagPosts = await getPostsByCategoryEqual(decodedTagName);
          // 如果精确匹配没有结果，尝试模糊匹配分类
          if (!tagPosts || tagPosts.length === 0) {
            tagPosts = await getPostsByCategory(decodedTagName);
            // 如果按分类查询没有结果，尝试按标签查询
            if (!tagPosts || tagPosts.length === 0) {
              tagPosts = await getPostsByTag(decodedTagName);
            }
          }
        } catch (error) {
          // 如果分类查询失败，尝试按标签查询
          tagPosts = await getPostsByTag(decodedTagName);
        }
        
        setPosts(tagPosts || []);
      } catch (error) {
        console.error("获取分类文章失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

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
        <div className="mb-12 text-center slide-up">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              分类
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-4">
            {tagName}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            共 {posts.length} 篇文章
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 glass-card slide-up">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">暂无文章</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">该分类下还没有文章。</p>
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
                <Card className="card-float h-full overflow-hidden glass-card border-0">
                  <div className="p-6 md:p-8">
                    <Link href={`/posts/${post.id}`}>
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
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
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
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default TagPostsPage;