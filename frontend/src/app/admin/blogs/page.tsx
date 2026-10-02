"use client";

import { FormEvent, useEffect, useState } from "react";

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

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [published, setPublished] = useState(false);
    const [featured, setFeatured] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadBlogs() {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("adminToken");

            if (!token) {
                setError("Please sign in again.");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/blogs/admin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load blogs");
            }

            const data = await response.json();
            setBlogs(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load blogs"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBlogs();
    }, []);

    function resetForm() {
        setTitle("");
        setSlug("");
        setExcerpt("");
        setContent("");
        setCoverImageUrl("");
        setPublished(false);
        setFeatured(false);
        setEditingId(null);
    }

    function startEditing(blog: Blog) {
        setEditingId(blog.id);
        setTitle(blog.title);
        setSlug(blog.slug);
        setExcerpt(blog.excerpt ?? "");
        setContent(blog.content);
        setCoverImageUrl(blog.coverImageUrl ?? "");
        setPublished(blog.published);
        setFeatured(blog.featured);

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function generateSlug(value: string) {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }

    function handleTitleChange(value: string) {
        setTitle(value);

        if (editingId === null) {
            setSlug(generateSlug(value));
        }
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");
        setError("");

        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Please sign in again.");
            return;
        }

        try {
            setSaving(true);

            const isEditing = editingId !== null;

            const url = isEditing
                ? `${API_URL}/api/blogs/${editingId}`
                : `${API_URL}/api/blogs`;

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    slug,
                    excerpt: excerpt || null,
                    content,
                    coverImageUrl: coverImageUrl || null,
                    published,
                    featured,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (isEditing
                        ? "Failed to update blog"
                        : "Failed to create blog")
                );
            }

            setMessage(
                isEditing
                    ? "Blog updated successfully."
                    : "Blog created successfully."
            );

            resetForm();
            await loadBlogs();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to save blog"
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: number) {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Please sign in again.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this blog?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setMessage("");
            setError("");

            const response = await fetch(
                `${API_URL}/api/blogs/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                let errorMessage = "Failed to delete blog";

                try {
                    const data = await response.json();

                    if (data.message) {
                        errorMessage = data.message;
                    }
                } catch {
                    // Empty DELETE response.
                }

                throw new Error(errorMessage);
            }

            if (editingId === id) {
                resetForm();
            }

            setMessage("Blog deleted successfully.");

            await loadBlogs();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete blog"
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                    Admin CMS
                </p>

                <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-bold">
                            Blogs
                        </h1>

                        <p className="mt-3 text-gray-400">
                            Create, update and manage your blog posts.
                        </p>
                    </div>

                    <a
                        href="/admin"
                        className="inline-flex w-fit rounded-xl border border-gray-800 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:text-white"
                    >
                        Back to Dashboard
                    </a>
                </div>

                {message && (
                    <div className="mt-8 rounded-xl border border-green-900 bg-green-950/30 px-5 py-4 text-sm text-green-400">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mt-8 rounded-xl border border-red-900 bg-red-950/30 px-5 py-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <section className="mt-10 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {editingId !== null
                                    ? "Edit Blog"
                                    : "Add Blog"}
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                {editingId !== null
                                    ? "Update the selected blog post."
                                    : "Create a new blog post for your portfolio."}
                            </p>
                        </div>

                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="w-fit rounded-xl border border-gray-800 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:text-white"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6"
                    >
                        <div>
                            <label
                                htmlFor="blog-title"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Title
                            </label>

                            <input
                                id="blog-title"
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    handleTitleChange(event.target.value)
                                }
                                placeholder="Building a REST API with Spring Boot"
                                required
                                maxLength={200}
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="blog-slug"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Slug
                            </label>

                            <input
                                id="blog-slug"
                                type="text"
                                value={slug}
                                onChange={(event) =>
                                    setSlug(event.target.value)
                                }
                                placeholder="building-a-rest-api-with-spring-boot"
                                required
                                maxLength={200}
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />

                            <p className="mt-2 text-xs text-gray-600">
                                Used in the public blog URL.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="blog-excerpt"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Excerpt
                            </label>

                            <textarea
                                id="blog-excerpt"
                                value={excerpt}
                                onChange={(event) =>
                                    setExcerpt(event.target.value)
                                }
                                placeholder="A short summary of the article..."
                                maxLength={500}
                                rows={3}
                                className="w-full resize-none rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="blog-content"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Content
                            </label>

                            <textarea
                                id="blog-content"
                                value={content}
                                onChange={(event) =>
                                    setContent(event.target.value)
                                }
                                placeholder="Write your blog content here..."
                                required
                                rows={12}
                                className="w-full resize-y rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="blog-cover"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Cover Image URL
                            </label>

                            <input
                                id="blog-cover"
                                type="url"
                                value={coverImageUrl}
                                onChange={(event) =>
                                    setCoverImageUrl(event.target.value)
                                }
                                placeholder="https://example.com/blog-cover.jpg"
                                maxLength={500}
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                            <label className="flex items-center gap-3 text-sm text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={published}
                                    onChange={(event) =>
                                        setPublished(event.target.checked)
                                    }
                                    className="h-4 w-4"
                                />

                                Published
                            </label>

                            <label className="flex items-center gap-3 text-sm text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(event) =>
                                        setFeatured(event.target.checked)
                                    }
                                    className="h-4 w-4"
                                />

                                Featured
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editingId !== null
                                    ? "Update Blog"
                                    : "Create Blog"}
                        </button>
                    </form>
                </section>

                <section className="mt-10">
                    <h2 className="text-2xl font-semibold">
                        Existing Blogs
                    </h2>

                    {loading ? (
                        <p className="mt-6 text-gray-500">
                            Loading blogs...
                        </p>
                    ) : blogs.length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                            <p className="text-gray-400">
                                No blogs added yet.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-4">
                            {blogs.map((blog) => (
                                <article
                                    key={blog.id}
                                    className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
                                >
                                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-xl font-semibold">
                                                    {blog.title}
                                                </h3>

                                                <span
                                                    className={`rounded-full border px-3 py-1 text-xs ${
                                                        blog.published
                                                            ? "border-green-900 text-green-400"
                                                            : "border-gray-800 text-gray-500"
                                                    }`}
                                                >
                                                    {blog.published
                                                        ? "Published"
                                                        : "Draft"}
                                                </span>

                                                {blog.featured && (
                                                    <span className="rounded-full border border-yellow-900 px-3 py-1 text-xs text-yellow-500">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-2 text-sm text-gray-600">
                                                /{blog.slug}
                                            </p>

                                            {blog.excerpt && (
                                                <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-400">
                                                    {blog.excerpt}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    startEditing(blog)
                                                }
                                                className="rounded-xl border border-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-600 hover:text-white"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(blog.id)
                                                }
                                                disabled={
                                                    deletingId === blog.id
                                                }
                                                className="rounded-xl border border-red-900 px-4 py-2 text-sm text-red-400 transition hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {deletingId === blog.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}