import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isBackoffice = request.nextUrl.pathname.startsWith("/backoffice");
  const isLogin = request.nextUrl.pathname === "/backoffice/login";

  if (isBackoffice && !isLogin && !user) {
    return NextResponse.redirect(new URL("/backoffice/login", request.url));
  }

  if (isLogin && user) {
    return NextResponse.redirect(new URL("/backoffice", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/backoffice/:path*"],
};
