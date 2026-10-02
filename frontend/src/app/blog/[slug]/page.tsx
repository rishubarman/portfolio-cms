type Blog = {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    coverImageUrl?: string | null;
    published: boolean;
    featured: boolean;
    publishedAt?: string | null;
    createdAt: string;
    updatedAt?: string | null;
};

type BlogPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function getBlog(slug: string): Promise<Blog | null> {
    try {
        const response = await fetch(
            `${API_URL}/api/blogs/slug/${encodeURIComponent(slug)}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch {
        return null;
    }
}

export default async function BlogArticlePage({
                                                  params,
                                              }: BlogPageProps) {
    const { slug } = await params;

    const blog = await getBlog(slug);

    if (!blog || !blog.published) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
                <div className="text-center">
                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                        Blog
                    </p>

                    <h1 className="mt-4 text-4xl font-bold">
                        Article not found
                    </h1>

                    <p className="mt-4 text-gray-500">
                        The blog post you are looking for does not exist.
                    </p>

                    <a
                        href="/#blog"
                        className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                    >
                        Back to Blog
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <article className="mx-auto max-w-4xl px-6 py-16 md:py-24">

                <a
                    href="/#blog"
                    className="text-sm text-gray-500 transition hover:text-white"
                >
                    ← Back to Blog
                </a>

                <div className="mt-10">
                    <div className="flex flex-wrap items-center gap-3">
                        {blog.featured && (
                            <span className="rounded-full border border-yellow-900 px-3 py-1 text-xs text-yellow-500">
                                Featured
                            </span>
                        )}

                        {blog.publishedAt && (
                            <span className="text-sm text-gray-500">
                                {new Date(
                                    blog.publishedAt
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            </span>
                        )}
                    </div>

                    <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                        {blog.title}
                    </h1>

                    {blog.excerpt && (
                        <p className="mt-6 text-lg leading-8 text-gray-400">
                            {blog.excerpt}
                        </p>
                    )}

                    {blog.coverImageUrl && (
                        <img
                            src={blog.coverImageUrl}
                            alt={blog.title}
                            className="mt-12 max-h-[500px] w-full rounded-2xl border border-gray-800 object-cover"
                        />
                    )}

                    <div className="mt-12 border-t border-gray-900 pt-12">
                        <div className="whitespace-pre-wrap text-lg leading-9 text-gray-300">
                            {blog.content}
                        </div>
                    </div>
                </div>
            </article>
        </main>
    );
}