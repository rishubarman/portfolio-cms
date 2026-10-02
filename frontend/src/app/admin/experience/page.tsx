"use client";

import { FormEvent, useEffect, useState } from "react";

type Experience = {
    id: number;
    company: string;
    role: string;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    current: boolean;
    description?: string | null;
    displayOrder: number;
    published: boolean;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminExperiencePage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [current, setCurrent] = useState(false);
    const [description, setDescription] = useState("");
    const [displayOrder, setDisplayOrder] = useState("0");
    const [published, setPublished] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadExperiences() {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("adminToken");

            if (!token) {
                setError("Please sign in again.");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/experience/admin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load experiences");
            }

            const data = await response.json();
            setExperiences(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load experiences"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadExperiences();
    }, []);

    function resetForm() {
        setCompany("");
        setRole("");
        setLocation("");
        setStartDate("");
        setEndDate("");
        setCurrent(false);
        setDescription("");
        setDisplayOrder("0");
        setPublished(true);
        setEditingId(null);
    }

    function startEditing(experience: Experience) {
        setEditingId(experience.id);
        setCompany(experience.company);
        setRole(experience.role);
        setLocation(experience.location ?? "");
        setStartDate(experience.startDate);
        setEndDate(experience.endDate ?? "");
        setCurrent(experience.current);
        setDescription(experience.description ?? "");
        setDisplayOrder(String(experience.displayOrder ?? 0));
        setPublished(experience.published);

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

        if (!startDate) {
            setError("Start date is required.");
            return;
        }

        try {
            setSaving(true);

            const isEditing = editingId !== null;

            const url = isEditing
                ? `${API_URL}/api/experience/${editingId}`
                : `${API_URL}/api/experience`;

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    company,
                    role,
                    location: location || null,
                    startDate,
                    endDate: current || !endDate ? null : endDate,
                    current,
                    description: description || null,
                    displayOrder: Number(displayOrder),
                    published,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (isEditing
                        ? "Failed to update experience"
                        : "Failed to create experience")
                );
            }

            setMessage(
                isEditing
                    ? "Experience updated successfully."
                    : "Experience created successfully."
            );

            resetForm();
            await loadExperiences();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to save experience"
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
            "Are you sure you want to delete this experience?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setMessage("");
            setError("");

            const response = await fetch(
                `${API_URL}/api/experience/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                let errorMessage = "Failed to delete experience";

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

            setMessage("Experience deleted successfully.");

            await loadExperiences();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete experience"
            );
        } finally {
            setDeletingId(null);
        }
    }

    function formatDate(date: string) {
        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                year: "numeric",
                month: "short",
            }
        );
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
                            Experience
                        </h1>

                        <p className="mt-3 text-gray-400">
                            Create, update and manage your professional experience.
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
                                    ? "Edit Experience"
                                    : "Add Experience"}
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                {editingId !== null
                                    ? "Update the selected experience."
                                    : "Add a professional experience entry."}
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
                                htmlFor="experience-company"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Company
                            </label>

                            <input
                                id="experience-company"
                                type="text"
                                value={company}
                                onChange={(event) =>
                                    setCompany(event.target.value)
                                }
                                placeholder="Company Name"
                                required
                                maxLength={150}
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="experience-role"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Role
                            </label>

                            <input
                                id="experience-role"
                                type="text"
                                value={role}
                                onChange={(event) =>
                                    setRole(event.target.value)
                                }
                                placeholder="Java Developer Intern"
                                required
                                maxLength={150}
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="experience-location"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Location
                            </label>

                            <input
                                id="experience-location"
                                type="text"
                                value={location}
                                onChange={(event) =>
                                    setLocation(event.target.value)
                                }
                                placeholder="Chandigarh, India"
                                maxLength={150}
                                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="experience-start"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Start Date
                                </label>

                                <input
                                    id="experience-start"
                                    type="date"
                                    value={startDate}
                                    onChange={(event) =>
                                        setStartDate(event.target.value)
                                    }
                                    required
                                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition focus:border-gray-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="experience-end"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    End Date
                                </label>

                                <input
                                    id="experience-end"
                                    type="date"
                                    value={endDate}
                                    disabled={current}
                                    onChange={(event) =>
                                        setEndDate(event.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-40 focus:border-gray-500"
                                />
                            </div>

                        </div>

                        <label className="flex items-center gap-3 text-sm text-gray-300">
                            <input
                                type="checkbox"
                                checked={current}
                                onChange={(event) =>
                                    setCurrent(event.target.checked)
                                }
                                className="h-4 w-4"
                            />

                            Currently working here
                        </label>

                        <div>
                            <label
                                htmlFor="experience-description"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Description
                            </label>

                            <textarea
                                id="experience-description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                placeholder="Describe your responsibilities, achievements and technologies..."
                                rows={8}
                                className="w-full resize-y rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="experience-order"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Display Order
                            </label>

                            <input
                                id="experience-order"
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
                                    ? "Update Experience"
                                    : "Create Experience"}
                        </button>

                    </form>
                </section>

                <section className="mt-10">

                    <h2 className="text-2xl font-semibold">
                        Existing Experience
                    </h2>

                    {loading ? (
                        <p className="mt-6 text-gray-500">
                            Loading experience...
                        </p>
                    ) : experiences.length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                            <p className="text-gray-400">
                                No experience added yet.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-4">
                            {[...experiences]
                                .sort(
                                    (a, b) =>
                                        a.displayOrder -
                                        b.displayOrder
                                )
                                .map((experience) => (
                                    <article
                                        key={experience.id}
                                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
                                    >
                                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">

                                            <div>
                                                <div className="flex flex-wrap items-center gap-3">

                                                    <h3 className="text-xl font-semibold">
                                                        {experience.role}
                                                    </h3>

                                                    <span
                                                        className={`rounded-full border px-3 py-1 text-xs ${
                                                            experience.published
                                                                ? "border-green-900 text-green-400"
                                                                : "border-gray-800 text-gray-500"
                                                        }`}
                                                    >
                                                        {experience.published
                                                            ? "Published"
                                                            : "Draft"}
                                                    </span>

                                                </div>

                                                <p className="mt-2 text-gray-300">
                                                    {experience.company}
                                                </p>

                                                {experience.location && (
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        {experience.location}
                                                    </p>
                                                )}

                                                <p className="mt-3 text-sm text-gray-500">
                                                    {formatDate(
                                                        experience.startDate
                                                    )}
                                                    {" — "}
                                                    {experience.current
                                                        ? "Present"
                                                        : experience.endDate
                                                            ? formatDate(
                                                                experience.endDate
                                                            )
                                                            : "N/A"}
                                                </p>

                                                {experience.description && (
                                                    <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-gray-400">
                                                        {experience.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-3">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        startEditing(
                                                            experience
                                                        )
                                                    }
                                                    className="rounded-xl border border-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-600 hover:text-white"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            experience.id
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        experience.id
                                                    }
                                                    className="rounded-xl border border-red-900 px-4 py-2 text-sm text-red-400 transition hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {deletingId ===
                                                    experience.id
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