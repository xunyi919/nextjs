'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPostById } from '@/lib/supabase/helpers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

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

const PostDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // 统一的返回处理函数
  const handleGoBack = () => {
    console.log('jinlai');
    
    // 检查是否有历史记录，如果有则返回，否则跳转到首页
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const resolvedParams = await params;
        // 支持数字ID或UUID字符串
        const postId = resolvedParams.id;
        
        setDebugInfo(`ID: ${postId} (${typeof postId})`);
        
        if (!postId || postId.trim() === '') {
          setError("无效的文章ID");
          setLoading(false);
          return;
        }
        
        // 解码URL编码的ID
        const decodedId = decodeURIComponent(postId);
        const postData = await getPostById(decodedId);
        
        
        if (!postData) {
          setError("文章不存在");
        } else {
          setPost(postData);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`文章加载失败: ${errorMessage}`);
        setDebugInfo(`错误: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen decorative-bg flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen decorative-bg flex justify-center items-center py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">文章未找到</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || "该文章不存在或已被删除"}</p>
          {debugInfo && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
              {debugInfo}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="btn-outline relative z-10 pointer-events-auto"
            >
              返回
            </Button>
            <Button 
              asChild
              className="btn-primary"
            >
              <Link href="/">返回首页</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen decorative-bg py-8 md:py-12 relative z-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* 返回按钮 */}
        <div className="mb-8 slide-up ">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="btn-outline relative z-10 pointer-events-auto"
          >
            <ArrowLeft className="w-4 h-4 pointer-events-none" />
            返回
          </Button>
        </div>

        {/* 文章内容 */}
        <article className="slide-up">
          <Card className="glass-card border-0 shadow-2xl overflow-hidden">
            {/* 文章头部 */}
            <div className="p-8 md:p-12 border-b border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6 leading-tight">
                  {post.title}
                </h1>
                
                {/* 文章元信息 */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(post.created_at).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {post.tag && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>标签</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 分类和标签显示 */}
              <div className="flex flex-wrap gap-2 mt-4">
                {post.category && post.category.split(',').map((cat, catIndex) => (
                  <Link
                    key={catIndex}
                    href={`/categories/${cat.trim()}`}
                    className="inline-block bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors duration-300"
                  >
                    📁 {cat.trim()}
                  </Link>
                ))}
                {post.tag && post.tag.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800/50"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* 文章正文 */}
            <div className="p-8 md:p-12">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-black dark:text-gray-300 leading-relaxed text-base md:text-lg">
                  {post.content.split('\n').map((paragraph, index, array) => {
                    // 处理空行和段落
                    const trimmed = paragraph.trim();
                    const prevTrimmed = index > 0 ? array[index - 1]?.trim() : '';
                    
                    // 如果是空行且前一行有内容，添加段落间距
                    if (!trimmed && prevTrimmed) {
                      return <div key={index} className="h-4" />;
                    }
                    
                    // 跳过连续的空行
                    if (!trimmed) {
                      return null;
                    }
                    
                    return (
                      <p key={index} className="mb-6 last:mb-0">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 文章底部 */}
            <div className="p-8 md:p-12 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>最后更新: {new Date(post.updated_at).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleGoBack}
                    className="btn-outline relative z-10 pointer-events-auto"
                  >
                    返回列表
                  </Button>
                  {/* <Button
                    asChild
                    className="btn-primary"
                  >
                    <Link href="/write">写文章</Link>
                  </Button> */}
                </div>
              </div>
            </div>
          </Card>
        </article>
      </div>
    </div>
  );
};

export default PostDetailPage;