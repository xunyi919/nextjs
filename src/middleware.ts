import { createServerClientInstance } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const supabase = await createServerClientInstance();
    
    // 获取当前用户的会话
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // 如果用户访问/write路径但明确没有会话，则重定向到登录页面
    if (request.nextUrl.pathname.startsWith("/write") && !session && !error) {
        // 重定向到登录页面，并携带原始URL作为参数
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
}

// 配置中间件应用于哪些路径
export const config = {
    matcher: [
        /*
         * 匹配所有请求路径除了那些以特定前缀开头的:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};