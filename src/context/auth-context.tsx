"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    user_metadata: {
        full_name?: string;
        avatar_url?: string;
    };
}

interface AuthContextType {
    user: User | null;
    signInWithGithub: () => void;
    signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
    signUpWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
    signOut: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = getSupabaseClient();

    useEffect(() => {
        
        // 检查当前用户会话
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user as User);
                } else {
                    setUser(null);
                }
            } catch (error) {
                // 静默处理错误
            } finally {
                // 确保在所有情况下都设置loading为false
                setLoading(false);
            }
        };

        checkSession();

        // 监听认证状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            if (session?.user) {
                setUser(session.user as User);
            } else {
                setUser(null);
            }
            // 确保在所有情况下都设置loading为false
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInWithGithub = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
            },
        });

        if (error) {
            // 静默处理错误
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { error };
    };

    const signUpWithEmail = async (email: string, password: string) => {
        const { error, data } = await supabase.auth.signUp({
            email,
            password,
        });

        // 如果注册成功且返回了用户数据，自动设置用户状态
        if (!error && data.user) {
            setUser(data.user as User);
        }

        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/");
    };

    const value = {
        user,
        signInWithGithub,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}