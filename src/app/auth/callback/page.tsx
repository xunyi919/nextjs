"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading } = useAuth();
    const supabase = getSupabaseClient();

    useEffect(() => {
        // 检查是否有错误参数
        const error = searchParams.get("error");
        if (error) {
            router.push("/login?error=auth_failed");
            return;
        }

        // 如果用户已登录，重定向到目标页面
        if (user) {
            const redirectTo = searchParams.get("redirect") || "/write";
            router.push(redirectTo);
        } else if (!loading) {
            // 手动检查会话状态
            const checkSession = async () => {
                try {
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.user) {
                        // 设置用户状态并重定向
                        // 如果有会话，直接重定向而不等待状态更新
                        const redirectTo = searchParams.get("redirect") || "/write";
                        // 给一点时间让认证上下文更新状态
                        setTimeout(() => {
                            router.push(redirectTo);
                        }, 100);
                    } else {
                        // 如果用户未登录且不在加载状态，重定向到登录页面
                        router.push("/login");
                    }
                } catch (err) {
                    router.push("/login");
                }
            };

            checkSession();
        }
    }, [user, loading, router, searchParams, supabase]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">正在处理登录...</h2>
                <p>请稍候，我们正在验证您的身份。</p>
                <p className="text-sm text-gray-500 mt-2">如果长时间停留在此页面，请刷新页面或重新登录。</p>
            </div>
        </div>
    );
}