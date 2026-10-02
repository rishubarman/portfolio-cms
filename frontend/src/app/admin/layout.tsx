"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type JwtPayload = {
    exp?: number;
};

function getTokenPayload(token: string): JwtPayload | null {
    try {
        const parts = token.split(".");

        if (parts.length !== 3) {
            return null;
        }

        const payload = parts[1];

        const decodedPayload = atob(
            payload.replace(/-/g, "+").replace(/_/g, "/")
        );

        return JSON.parse(decodedPayload);
    } catch {
        return null;
    }
}

async function refreshAccessToken(): Promise<boolean> {
    const refreshToken =
        localStorage.getItem("adminRefreshToken");

    if (!refreshToken) {
        return false;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/auth/refresh`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refreshToken,
                }),
            }
        );

        if (!response.ok) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminRefreshToken");
            return false;
        }

        const data = await response.json();

        localStorage.setItem(
            "adminToken",
            data.token
        );

        if (data.refreshToken) {
            localStorage.setItem(
                "adminRefreshToken",
                data.refreshToken
            );
        }

        return true;
    } catch {
        return false;
    }
}

export default function AdminLayout({
                                        children,
                                    }: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();

    const [checkingAuth, setCheckingAuth] =
        useState(true);

    useEffect(() => {
        let refreshTimer: ReturnType<typeof setTimeout> | null =
            null;

        async function checkAuthentication() {
            const token =
                localStorage.getItem("adminToken");

            const refreshToken =
                localStorage.getItem("adminRefreshToken");

            if (
                !token &&
                !refreshToken &&
                pathname !== "/admin/login"
            ) {
                router.replace("/admin/login");
                return;
            }

            if (pathname === "/admin/login") {
                setCheckingAuth(false);
                return;
            }

            if (!token) {
                const refreshed =
                    await refreshAccessToken();

                if (!refreshed) {
                    router.replace("/admin/login");
                    return;
                }

                setCheckingAuth(false);
                return;
            }

            const payload =
                getTokenPayload(token);

            if (!payload?.exp) {
                const refreshed =
                    await refreshAccessToken();

                if (!refreshed) {
                    router.replace("/admin/login");
                    return;
                }

                setCheckingAuth(false);
                return;
            }

            const expirationTime =
                payload.exp * 1000;

            const currentTime =
                Date.now();

            const timeUntilExpiration =
                expirationTime - currentTime;

            const refreshBeforeExpiration =
                60 * 1000;

            if (
                timeUntilExpiration <=
                refreshBeforeExpiration
            ) {
                const refreshed =
                    await refreshAccessToken();

                if (!refreshed) {
                    router.replace("/admin/login");
                    return;
                }
            }

            const refreshedToken =
                localStorage.getItem("adminToken");

            const refreshedPayload =
                refreshedToken
                    ? getTokenPayload(refreshedToken)
                    : null;

            if (refreshedPayload?.exp) {
                const nextExpiration =
                    refreshedPayload.exp * 1000;

                const nextRefreshTime =
                    Math.max(
                        nextExpiration -
                        Date.now() -
                        60 * 1000,
                        5000
                    );

                refreshTimer = setTimeout(
                    checkAuthentication,
                    nextRefreshTime
                );
            }

            setCheckingAuth(false);
        }

        checkAuthentication();

        return () => {
            if (refreshTimer) {
                clearTimeout(refreshTimer);
            }
        };
    }, [pathname, router]);

    function handleLogout() {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");

        window.location.href = "/admin/login";
    }

    if (
        checkingAuth &&
        pathname !== "/admin/login"
    ) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black text-white">
                <p className="text-sm text-gray-500">
                    Checking authentication...
                </p>
            </main>
        );
    }

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex min-h-16 items-center justify-between gap-6">

                        <a
                            href="/admin"
                            className="shrink-0 text-lg font-bold tracking-tight text-white"
                        >
                            Portfolio CMS
                        </a>

                        <nav className="hidden items-center gap-1 xl:flex">
                            <a
                                href="/admin"
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
                            >
                                Dashboard
                            </a>

                            <a
                                href="/admin/projects"
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
                            >
                                Projects
                            </a>

                            <a
                                href="/admin/about"
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
                            >
                                About
                            </a>

                            <a
                                href="/admin/skills"
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
                            >
                                Skills
                            </a>

                            <a
                                href="/admin/experience"
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
                            >
                                Experience
                            </a>

                            <a
                                href="/admin/blogs"
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
                            >
                                Blogs
                            </a>

                            <a
                                href="/admin/testimonials"
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
                            >
                                Testimonials
                            </a>

                            <a
                                href="/admin/services"
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
                            >
                                Services
                            </a>

                            <a
                                href="/admin/media"
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
                            >
                                Media
                            </a>

                            <a
                                href="/admin/contacts"
                                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
                            >
                                Contacts
                            </a>
                        </nav>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="shrink-0 rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950 hover:text-red-300"
                        >
                            Logout
                        </button>

                    </div>
                </div>
            </header>

            {children}
        </div>
    );
}