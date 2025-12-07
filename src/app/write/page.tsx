'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { insertPost } from '@/lib/supabase/helpers';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


export default function WritePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [published, setPublished] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState('');

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // 保存文章
  const handleSave = async (shouldPublish: boolean) => {
    console.log('handleSave 被调用, shouldPublish:', shouldPublish, 'saving:', saving);
    
    if (!title.trim()) {
      alert('请输入文章标题');
      return;
    }

    if (!content.trim()) {
      alert('请输入文章内容');
      return;
    }

    if (!category.trim()) {
      alert('请输入文章分类');
      return;
    }

    if (saving) {
      console.log('正在保存中，忽略重复点击');
      return; // 防止重复提交
    }

    console.log('开始保存文章...');
    setSaving(true);
    
    try {
      if (!user) {
        throw new Error("用户未认证");
      }

      // 调用 insertPost 函数保存文章（不传slug，让函数自动生成）
      // 参数顺序：title, content, tag, userId, category, slug, published, isPublic
      const result = await insertPost(
        title, 
        content, 
        tag.trim() || '', 
        user.id, 
        category.trim(), 
        undefined, 
        shouldPublish, 
        isPublic
      );
      
      if (result) {
        alert(shouldPublish ? '文章发布成功！' : '草稿保存成功！');
        // 清空表单
        setTitle('');
        setCategory('');
        setTag('');
        setContent('');
        router.push('/');
      } else {
        alert('保存失败，请重试');
      }
    } catch (error) {
      console.error('保存文章时出错:', error);
      alert(`保存失败: ${error instanceof Error ? error.message : '请重试'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12 decorative-bg relative z-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* 头部区域 */}
        <div className="mb-8 slide-up relative z-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                创作中心
              </h1>
              <p className="text-gray-600 dark:text-gray-400">分享您的知识和见解</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto relative z-20">
              {/* <Button 
                type="button"
                variant="outline" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('保存草稿按钮被点击, saving:', saving);
                  if (!saving) {
                    handleSave(false);
                  }
                }}
                disabled={saving}
                className="btn-outline w-full sm:w-auto cursor-pointer"
                style={{ pointerEvents: saving ? 'none' : 'auto' }}
              >
                {saving ? '保存中...' : '保存草稿'}
              </Button> */}
              <Button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('发布文章按钮被点击, saving:', saving);
                  if (!saving) {
                    handleSave(true);
                  }
                }}
                disabled={saving}
                className="btn-outline w-full sm:w-auto cursor-pointer"
                style={{ pointerEvents: saving ? 'none' : 'auto' }}
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    发布中...
                  </div>
                ) : (
                  '发布文章'
                )}
              </Button>
            </div>
          </div>
        </div>

        <Card className="glass-card shadow-2xl border-0 fade-in">
          <div className="p-6 md:p-8 lg:p-10">
            <div className="space-y-8">
              {/* 标题输入 */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold text-base">
                  文章标题
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入一个吸引人的标题..."
                  className="input-field text-lg"
                />
              </div>

              {/* 分类输入 */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700 dark:text-gray-300 font-semibold text-base">
                  分类 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="例如：web3,合约开发,solidity (多个分类用逗号分隔)"
                  className="input-field"
                />
                <p className="text-xs text-gray-700 dark:text-gray-400">输入文章分类，多个分类用逗号分隔。分类会自动保存到分类表中。</p>
              </div>

              {/* 标签输入 */}
              <div className="space-y-2">
                <Label htmlFor="tag" className="text-gray-700 dark:text-gray-300 font-semibold text-base">
                  标签
                </Label>
                <Input
                  id="tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="技术, 教程, 分享 (多个标签用逗号分隔)"
                  className="input-field"
                />
                <p className="text-xs text-gray-700 dark:text-gray-400">添加相关标签，帮助读者发现您的内容</p>
              </div>

              {/* 文章内容 */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-700 dark:text-gray-300 font-semibold text-base">
                  文章内容
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="开始写作... 分享您的想法、经验和知识"
                  rows={20}
                  className="input-field resize-none font-sans leading-relaxed"
                />
                <div className="flex justify-between items-center text-xs text-gray-700 dark:text-gray-400">
                  <span>字数: {content.length}</span>
                  <span>行数: {content.split('\n').length}</span>
                </div>
              </div>

              {/* 发布选项 */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">发布设置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex items-start space-x-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all duration-300 group">
                    <input
                      id="published"
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="mt-1 w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div>
                      <div className="font-semibold text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        立即发布
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        文章将立即对所有人可见
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all duration-300 group">
                    <input
                      id="is-public"
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="mt-1 w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div>
                      <div className="font-semibold text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        公开文章
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        允许所有人查看此文章
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}