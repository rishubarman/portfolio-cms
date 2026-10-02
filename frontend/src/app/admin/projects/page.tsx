"use client";

import { FormEvent, useEffect, useState } from "react";

type Project = {
    id: number;
    title: string;
    description: string;
    shortDescription?: string | null;
    imageUrl?: string | null;
    githubUrl?: string | null;
    liveUrl?: string | null;
    techStack?: string | null;
    featured: boolean;
    published: boolean;
    displayOrder?: number | null;
};

type Media = {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [media, setMedia] = useState<Media[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingMedia, setLoadingMedia] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [techStack, setTechStack] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [liveUrl, setLiveUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [featured, setFeatured] = useState(false);
    const [published, setPublished] = useState(true);
    const [displayOrder, setDisplayOrder] = useState("0");

    async function loadProjects() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/projects`
            );

            if (!response.ok) {
                throw new Error("Failed to load projects");
            }

            const data = await response.json();

            setProjects(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load projects"
            );
        } finally {
            setLoading(false);
        }
    }

    async function loadMedia() {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            setLoadingMedia(false);
            return;
        }

        try {
            setLoadingMedia(true);

            const response = await fetch(
                `${API_URL}/api/upload/media`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load media");
            }

            const data = await response.json();

            setMedia(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load media"
            );
        } finally {
            setLoadingMedia(false);
        }
    }

    useEffect(() => {
        loadProjects();
        loadMedia();
    }, []);

    function resetForm() {
        setTitle("");
        setDescription("");
        setShortDescription("");
        setTechStack("");
        setGithubUrl("");
        setLiveUrl("");
        setImageUrl("");
        setFeatured(false);
        setPublished(true);
        setDisplayOrder("0");
        setEditingId(null);
    }

    function startEditing(project: Project) {
        setEditingId(project.id);

        setTitle(project.title);
        setDescription(project.description);
        setShortDescription(project.shortDescription ?? "");
        setTechStack(project.techStack ?? "");
        setGithubUrl(project.githubUrl ?? "");
        setLiveUrl(project.liveUrl ?? "");
        setImageUrl(project.imageUrl ?? "");
        setFeatured(project.featured);
        setPublished(project.published);
        setDisplayOrder(
            String(project.displayOrder ?? 0)
        );

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
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
                ? `${API_URL}/api/projects/${editingId}`
                : `${API_URL}/api/projects`;

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    shortDescription,
                    techStack,
                    githubUrl: githubUrl || null,
                    liveUrl: liveUrl || null,
                    imageUrl: imageUrl || null,
                    featured,
                    published,
                    displayOrder: Number(displayOrder),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (isEditing
                        ? "Failed to update project"
                        : "Failed to create project")
                );
            }

            setMessage(
                isEditing
                    ? "Project updated successfully."
                    : "Project created successfully."
            );

            resetForm();

            await loadProjects();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : editingId !== null
                        ? "Failed to update project"
                        : "Failed to create project"
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
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setMessage("");
            setError("");

            const response = await fetch(
                `${API_URL}/api/projects/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                let errorMessage =
                    "Failed to delete project";

                try {
                    const data = await response.json();

                    if (data.message) {
                        errorMessage = data.message;
                    }
                } catch {
                    // Response has no JSON body.
                }

                throw new Error(errorMessage);
            }

            if (editingId === id) {
                resetForm();
            }

            setMessage("Project deleted successfully.");

            await loadProjects();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete project"
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
                            Projects
                        </h1>

                        <p className="mt-3 text-gray-400">
                            Create, update and manage your portfolio projects.
                        </p>
                    </div>

                    <a
                        href="/admin"
                        className="inline-flex w-fit rounded-xl border border-gray-800 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:text-white"
                    >
                        Back to Dashboard
                    </a>
                </div>

                <section className="mt-10 rounded-2xl border border-gray-800 bg-gray-950 p-8">

                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {editingId !== null
                                    ? "Edit Project"
                                    : "Add Project"}
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                {editingId !== null
                                    ? "Update the selected project."
                                    : "Add a new project to your portfolio."}
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
                                htmlFor="title"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Title
                            </label>

                            <input
                                id="title"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                required
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                required
                                rows={5}
                                className="w-full resize-none rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="shortDescription"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Short Description
                            </label>

                            <input
                                id="shortDescription"
                                value={shortDescription}
                                onChange={(event) =>
                                    setShortDescription(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="techStack"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Tech Stack
                            </label>

                            <input
                                id="techStack"
                                value={techStack}
                                onChange={(event) =>
                                    setTechStack(event.target.value)
                                }
                                placeholder="Java, Spring Boot, PostgreSQL"
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        {/* Media Library */}
                        <div>
                            <label
                                htmlFor="imageUrl"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Project Image
                            </label>

                            {loadingMedia ? (
                                <div className="rounded-xl border border-gray-800 bg-black px-4 py-3 text-sm text-gray-500">
                                    Loading media library...
                                </div>
                            ) : media.length === 0 ? (
                                <div className="rounded-xl border border-gray-800 bg-black px-4 py-4">
                                    <p className="text-sm text-gray-400">
                                        No uploaded images available.
                                    </p>

                                    <a
                                        href="/admin/media"
                                        className="mt-2 inline-block text-sm text-white underline underline-offset-4"
                                    >
                                        Go to Media Library
                                    </a>
                                </div>
                            ) : (
                                <select
                                    id="imageUrl"
                                    value={imageUrl}
                                    onChange={(event) =>
                                        setImageUrl(
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                                >
                                    <option value="">
                                        No project image
                                    </option>

                                    {media.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item.fileUrl}
                                        >
                                            {item.fileName}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {imageUrl && (
                                <div className="mt-4 overflow-hidden rounded-2xl border border-gray-800 bg-black p-4">
                                    <p className="mb-3 text-xs uppercase tracking-wider text-gray-500">
                                        Selected Image
                                    </p>

                                    <img
                                        src={`${API_URL}${imageUrl}`}
                                        alt="Selected project image"
                                        className="max-h-64 w-full rounded-xl object-contain"
                                    />

                                    <p className="mt-3 break-all text-xs text-gray-500">
                                        {API_URL}
                                        {imageUrl}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="githubUrl"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    GitHub URL
                                </label>

                                <input
                                    id="githubUrl"
                                    type="url"
                                    value={githubUrl}
                                    onChange={(event) =>
                                        setGithubUrl(
                                            event.target.value
                                        )
                                    }
                                    placeholder="https://github.com/..."
                                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="liveUrl"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Live URL
                                </label>

                                <input
                                    id="liveUrl"
                                    type="url"
                                    value={liveUrl}
                                    onChange={(event) =>
                                        setLiveUrl(
                                            event.target.value
                                        )
                                    }
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-500"
                                />
                            </div>

                        </div>

                        <div>
                            <label
                                htmlFor="displayOrder"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Display Order
                            </label>

                            <input
                                id="displayOrder"
                                type="number"
                                value={displayOrder}
                                onChange={(event) =>
                                    setDisplayOrder(
                                        event.target.value
                                    )
                                }
                                min="0"
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                            />
                        </div>

                        <div className="flex flex-wrap gap-6">

                            <label className="flex items-center gap-3 text-sm text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(event) =>
                                        setFeatured(
                                            event.target.checked
                                        )
                                    }
                                    className="h-4 w-4"
                                />

                                Featured
                            </label>

                            <label className="flex items-center gap-3 text-sm text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={published}
                                    onChange={(event) =>
                                        setPublished(
                                            event.target.checked
                                        )
                                    }
                                    className="h-4 w-4"
                                />

                                Published
                            </label>

                        </div>

                        {message && (
                            <p className="rounded-xl border border-green-900 bg-green-950/30 px-4 py-3 text-sm text-green-400">
                                {message}
                            </p>
                        )}

                        {error && (
                            <p className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editingId !== null
                                    ? "Update Project"
                                    : "Create Project"}
                        </button>

                    </form>
                </section>

                <section className="mt-10">

                    <h2 className="text-2xl font-semibold">
                        Existing Projects
                    </h2>

                    {loading ? (
                        <p className="mt-6 text-gray-500">
                            Loading projects...
                        </p>
                    ) : projects.length === 0 ? (
                        <p className="mt-6 text-gray-500">
                            No projects found.
                        </p>
                    ) : (
                        <div className="mt-6 space-y-4">

                            {projects.map((project) => (
                                <article
                                    key={project.id}
                                    className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
                                >

                                    <div className="flex flex-col justify-between gap-5 md:flex-row">

                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-gray-600">
                                                Project #{project.id}
                                            </p>

                                            <h3 className="mt-2 text-xl font-semibold">
                                                {project.title}
                                            </h3>

                                            <p className="mt-2 text-sm text-gray-400">
                                                {project.shortDescription ||
                                                    project.description}
                                            </p>

                                            {project.techStack && (
                                                <p className="mt-3 text-xs text-gray-500">
                                                    {project.techStack}
                                                </p>
                                            )}

                                            {project.imageUrl && (
                                                <div className="mt-4">
                                                    <img
                                                        src={`${API_URL}${project.imageUrl}`}
                                                        alt={project.title}
                                                        className="h-32 w-48 rounded-xl object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-start gap-3">

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs ${
                                                    project.published
                                                        ? "border-green-900 text-green-400"
                                                        : "border-gray-800 text-gray-500"
                                                }`}
                                            >
                                                {project.published
                                                    ? "Published"
                                                    : "Draft"}
                                            </span>

                                            {project.featured && (
                                                <span className="rounded-full border border-gray-800 px-3 py-1 text-xs text-gray-400">
                                                    Featured
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    startEditing(project)
                                                }
                                                className="rounded-lg border border-gray-700 px-3 py-1 text-xs font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        project.id
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    project.id
                                                }
                                                className="rounded-lg border border-red-900 px-3 py-1 text-xs font-medium text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {deletingId ===
                                                project.id
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