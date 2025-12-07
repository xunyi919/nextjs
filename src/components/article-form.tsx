"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ArticleFormProps {
    onSubmit: (data: ArticleFormData) => void;
    initialData?: ArticleFormData;
}

export interface ArticleFormData {
    title: string;
    date: string;
    author: string;
    tag: string;
    content: string;
}

const ArticleForm = ({ onSubmit, initialData }: ArticleFormProps) => {
    const [formData, setFormData] = useState<ArticleFormData>(
        initialData || {
            title: "",
            date: new Date().toISOString().split("T")[0],
            author: "",
            tag: "",
            content: "",
        }
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-gray-800">文章信息</CardTitle>
                <p className="text-gray-600">请填写以下文章信息</p>
            </CardHeader>
            
            <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-gray-700">
                            标题 *
                        </label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="请输入文章标题"
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-3 px-4 text-base"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="date" className="text-sm font-medium text-gray-700">
                                日期 *
                            </label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-3 px-4 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="author" className="text-sm font-medium text-gray-700">
                                作者 *
                            </label>
                            <Input
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="请输入作者姓名"
                                required
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-3 px-4 text-base"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="tag" className="text-sm font-medium text-gray-700">
                            标签
                        </label>
                        <Input
                            id="tag"
                            name="tag"
                            value={formData.tag}
                            onChange={handleChange}
                            placeholder="请输入标签，多个标签用逗号分隔"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-3 px-4 text-base"
                        />
                        <p className="text-xs text-gray-500 mt-1">提示：多个标签请用逗号分隔，例如：技术,编程,Web3</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium text-gray-700">
                            内容 *
                        </label>
                        <Textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="请输入文章内容"
                            rows={12}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-3 px-4 text-base resize-y min-h-[200px]"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button 
                            type="submit" 
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            发布文章
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ArticleForm;