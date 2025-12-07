"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 创建一个独立的组件来处理需要 useSearchParams 的逻辑
function LoginContent() {
    const { user, loading, signInWithGithub, signInWithEmail, signUpWithEmail } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);

    // 检查错误消息
    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            setErrorMessage("登录过程中出现错误，请重试。");
        }
        
        // 如果用户已登录，重定向到写文章页面
        if (user) {
            router.push("/write");
        }
    }, [user, searchParams, router]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        try {
            let result;
            if (isSignUp) {
                result = await signUpWithEmail(email, password);
            } else {
                result = await signInWithEmail(email, password);
            }

            if (result.error) {
                setErrorMessage(result.error.message || (isSignUp ? '注册失败，请重试。' : '登录失败，请重试。'));
            } else if (isSignUp) {
                // 注册成功后自动切换到登录视图
                setIsSignUp(false);
                setErrorMessage('注册成功！请使用您的邮箱和密码登录。');
                
                // 自动聚焦到密码字段
                setTimeout(() => {
                    if (passwordRef.current) {
                        passwordRef.current.focus();
                    }
                }, 100);
            }
        } catch (error) {
            setErrorMessage(isSignUp ? '注册过程中出现错误。' : '登录过程中出现错误。');
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen decorative-bg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen py-12 decorative-bg relative z-10">
            <div className="w-full max-w-md fade-in">
                <Card className="glass-card shadow-2xl border-0 overflow-hidden">
                    {/* 头部渐变区域 */}
                    <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white overflow-hidden">
                        <div className="absolute inset-0 grid-pattern opacity-10"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                        
                        <CardHeader className="p-0 relative z-10">
                            <CardTitle className="text-3xl font-bold mb-2">
                                {isSignUp ? '创建账户' : '欢迎回来'}
                            </CardTitle>
                            <CardDescription className="text-white/90 text-base">
                                {isSignUp 
                                    ? '创建新账户以开始您的博客之旅' 
                                    : '登录到您的博客账户'}
                            </CardDescription>
                        </CardHeader>
                    </div>
                    
                    <CardContent className="pt-8 px-8 pb-6">
                        {errorMessage && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium">
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-6">
                            <form onSubmit={handleEmailAuth} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold">
                                        邮箱
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@example.com"
                                        required
                                        className="input-field"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold">
                                        密码
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="至少6位字符"
                                        required
                                        minLength={6}
                                        ref={passwordRef}
                                        className="input-field"
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                            处理中...
                                        </div>
                                    ) : isSignUp ? (
                                        '创建账户'
                                    ) : (
                                        '登录'
                                    )}
                                </Button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                        或者继续使用
                                    </span>
                                </div>
                            </div>

                            <Button 
                                onClick={() => setIsSignUp(!isSignUp)} 
                                variant="outline" 
                                className="w-full btn-outline"
                            >
                                {isSignUp ? '已有账户？点击登录' : '没有账户？点击注册'}
                            </Button>
                        </div>
                    </CardContent>
                    
                    <CardFooter className="bg-gray-50 dark:bg-gray-900/50 p-6 border-t border-gray-200 dark:border-gray-700">
                        <Button 
                            onClick={signInWithGithub} 
                            className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Github className="mr-2 h-5 w-5" />
                            使用GitHub登录
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

// 主组件包装在 Suspense 中
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen decorative-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}