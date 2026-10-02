"use client";

import { FormEvent, useEffect, useState } from "react";

type Skill = {
    id: number;
    name: string;
    category?: string | null;
    iconUrl?: string | null;
    displayOrder: number;
    published: boolean;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [displayOrder, setDisplayOrder] = useState("0");
    const [published, setPublished] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadSkills() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/api/skills`);

            if (!response.ok) {
                throw new Error("Failed to load skills");
            }

            const data = await response.json();
            setSkills(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load skills"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSkills();
    }, []);

    function resetForm() {
        setName("");
        setCategory("");
        setIconUrl("");
        setDisplayOrder("0");
        setPublished(true);
        setEditingId(null);
    }

    function startEditing(skill: Skill) {
        setEditingId(skill.id);
        setName(skill.name);
        setCategory(skill.category ?? "");
        setIconUrl(skill.iconUrl ?? "");
        setDisplayOrder(String(skill.displayOrder ?? 0));
        setPublished(skill.published);

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
                ? `${API_URL}/api/skills/${editingId}`
                : `${API_URL}/api/skills`;

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    category,
                    iconUrl: iconUrl || null,
                    displayOrder: Number(displayOrder),
                    published,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (isEditing
                        ? "Failed to update skill"
                        : "Failed to create skill")
                );
            }

            setMessage(
                isEditing
                    ? "Skill updated successfully."
                    : "Skill created successfully."
            );

            resetForm();
            await loadSkills();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to save skill"
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
            "Are you sure you want to delete this skill?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setMessage("");
            setError("");

            const response = await fetch(
                `${API_URL}/api/skills/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                let errorMessage = "Failed to delete skill";

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

            setMessage("Skill deleted successfully.");

            await loadSkills();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete skill"
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
                            Skills
                        </h1>

                        <p className="mt-3 text-gray-400">
                            Create, update and manage your technical skills.
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
                                    ? "Edit Skill"
                                    : "Add Skill"}
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                {editingId !== null
                                    ? "Update the selected skill."
                                    : "Add a new skill to your portfolio."}
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
                                htmlFor="skill-name"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Skill Name
                            </label>

                            <input
                                id="skill-name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Java"
                                required
                                maxLength={100}
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="skill-category"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Category
                            </label>

                            <input
                                id="skill-category"
                                type="text"
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value)
                                }
                                placeholder="Backend"
                                maxLength={50}
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="skill-icon"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Icon URL
                            </label>

                            <input
                                id="skill-icon"
                                type="url"
                                value={iconUrl}
                                onChange={(event) =>
                                    setIconUrl(event.target.value)
                                }
                                placeholder="https://example.com/java.svg"
                                maxLength={100}
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="skill-order"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Display Order
                            </label>

                            <input
                                id="skill-order"
                                type="number"
                                value={displayOrder}
                                onChange={(event) =>
                                    setDisplayOrder(event.target.value)
                                }
                                min="0"
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition focus:border-gray-500"
                            />
                        </div>

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

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editingId !== null
                                    ? "Update Skill"
                                    : "Create Skill"}
                        </button>

                    </form>
                </section>

                <section className="mt-10">

                    <h2 className="text-2xl font-semibold">
                        Existing Skills
                    </h2>

                    {loading ? (
                        <p className="mt-6 text-gray-500">
                            Loading skills...
                        </p>
                    ) : skills.length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                            <p className="text-gray-400">
                                No skills added yet.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {[...skills]
                                .sort(
                                    (a, b) =>
                                        a.displayOrder -
                                        b.displayOrder
                                )
                                .map((skill) => (
                                    <article
                                        key={skill.id}
                                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
                                    >
                                        <div className="flex items-start justify-between gap-4">

                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    {String(
                                                        skill.displayOrder
                                                    ).padStart(2, "0")}
                                                </p>

                                                <h3 className="mt-2 text-xl font-semibold">
                                                    {skill.name}
                                                </h3>

                                                {skill.category && (
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        {skill.category}
                                                    </p>
                                                )}
                                            </div>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs ${
                                                    skill.published
                                                        ? "border-green-900 text-green-400"
                                                        : "border-gray-800 text-gray-500"
                                                }`}
                                            >
                                                {skill.published
                                                    ? "Published"
                                                    : "Draft"}
                                            </span>

                                        </div>

                                        <div className="mt-6 flex gap-3">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    startEditing(skill)
                                                }
                                                className="rounded-xl border border-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-600 hover:text-white"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(skill.id)
                                                }
                                                disabled={
                                                    deletingId === skill.id
                                                }
                                                className="rounded-xl border border-red-900 px-4 py-2 text-sm text-red-400 transition hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {deletingId === skill.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>

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