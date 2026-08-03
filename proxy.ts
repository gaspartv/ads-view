import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicGlobalRoutes = [
  "/",
  "/contact",
  "/products",
  "/products/tibia-coins",
  "/products/characters",
  "/products/characters/*",
  "/products/account-loyalty",
];
const publicRoutes = ["/sign-in", "/sign-up"];
const authenticatedRoutes = [];
const adminRoutePrefix = "/admin";

const moduleRoutePrefixes = [
  { prefix: "/admin/dashboard/products/tibia-coins", code: "MD-001" },
  { prefix: "/products/tibia-coins", code: "MD-001" },
  { prefix: "/admin/dashboard/products/account-loyalty", code: "MD-002" },
  { prefix: "/products/account-loyalty", code: "MD-002" },
  { prefix: "/admin/dashboard/products/characters", code: "MD-003" },
  { prefix: "/products/characters", code: "MD-003" },
  { prefix: "/products/characters/*", code: "MD-003" },
  { prefix: "/admin/dashboard/reports", code: "MD-004" },
  { prefix: "/admin/dashboard/orders", code: "MD-005" },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const origin = host ? `${protocol}://${host}` : "";

  // 1. Verificação de Módulos (Aplicado tanto em rotas públicas quanto no admin)
  const requiredModule = moduleRoutePrefixes.find((m) =>
    pathname.startsWith(m.prefix),
  );

  if (requiredModule) {
    try {
      const apiUrl = process.env.API_URL!;

      const res = await fetch(`${apiUrl}/info/list/modules`, {
        headers: { ...(origin ? { origin } : {}) },
      });

      if (res.ok) {
        const data = await res.json();
        const activeModules =
          data?.CompanyModules?.map((cm: any) => cm?.Module?.code) || [];

        if (!activeModules.includes(requiredModule.code)) {
          // Módulo não está ativo para esta empresa
          const redirectUrl = request.nextUrl.clone();
          // Redireciona de volta ao dashboard se for admin, senão para a home
          redirectUrl.pathname = pathname.startsWith("/admin")
            ? "/admin/dashboard"
            : "/";
          return NextResponse.redirect(redirectUrl);
        }
      }
    } catch (e) {
      console.error("Erro ao validar módulos no proxy:", e);
    }
  }

  // Recupera o token JWT dos cookies primeiro
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  // 1. Verifica se a rota é pública
  const isPublicGlobal = publicGlobalRoutes.some((route) => {
    if (route.endsWith("/*")) {
      return pathname.startsWith(route.slice(0, -2));
    }
    return route === pathname;
  });

  if (isPublicGlobal) {
    return NextResponse.next();
  } else if (publicRoutes.includes(pathname)) {
    // Se for rota pública específica (ex: login) e usuário já tiver token, manda para a home
    if (token) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }

  // Se a rota não for pública e não houver token, redireciona para o sign-in
  if (!token) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(signInUrl);
  }

  // 2. Verifica na API se o token é válido
  try {
    const apiUrl = process.env.API_URL!;
    const response = await fetch(`${apiUrl}/user/is-valid-auth`, {
      headers: {
        ...(token ? { Cookie: `access_token=${token}` } : {}),
        ...(origin ? { origin } : {}),
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao validar token");
    }

    const data = await response.json();

    if (!data.isValid) {
      const signInUrl = request.nextUrl.clone();
      signInUrl.pathname = "/sign-in";
      signInUrl.searchParams.set(
        "error",
        "Sessão finalizada, realize o login novamente.",
      );
      signInUrl.searchParams.set(
        "callbackUrl",
        request.nextUrl.pathname + request.nextUrl.search,
      );
      const redirectResponse = NextResponse.redirect(signInUrl);
      redirectResponse.cookies.delete("access_token");
      return redirectResponse;
    }
  } catch (error) {
    // Se houver erro na API ou token inválido, desloga / manda pro login
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set(
      "error",
      "Sessão finalizada, realize o login novamente.",
    );
    signInUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    const redirectResponse = NextResponse.redirect(signInUrl);
    redirectResponse.cookies.delete("access_token");
    return redirectResponse;
  }

  // 3. Verificação específica para rotas ADMIN
  if (pathname.startsWith(adminRoutePrefix)) {
    try {
      // Verifica na API se o usuário é admin
      const apiUrl = process.env.API_URL!;
      const response = await fetch(`${apiUrl}/user/is-admin`, {
        headers: {
          ...(token ? { Cookie: `access_token=${token}` } : {}),
          ...(origin ? { origin } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao validar admin");
      }

      const data = await response.json();

      if (!data.isAdmin) {
        const homeUrl = request.nextUrl.clone();
        homeUrl.pathname = "/"; // Retorna para a raiz caso não seja admin
        return NextResponse.redirect(homeUrl);
      }
    } catch (error) {
      // Se houver erro na API ou token inválido, desloga / manda pro login
      const signInUrl = request.nextUrl.clone();
      signInUrl.pathname = "/sign-in";
      signInUrl.searchParams.set(
        "callbackUrl",
        request.nextUrl.pathname + request.nextUrl.search,
      );
      return NextResponse.redirect(signInUrl);
    }
  }

  // 4. Rotas Autenticadas (incluindo /sign-up temporariamente e qualquer outra que venha a existir)
  // Como o usuário tem token e passou pela validação, liberamos o acesso.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
