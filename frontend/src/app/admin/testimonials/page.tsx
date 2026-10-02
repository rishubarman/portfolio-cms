"use client";

import { FormEvent, useEffect, useState } from "react";
import API_URL from "../../../../lib/api";

type Testimonial = {
    id: number;
    name: string;
    role?: string | null;
    company?: string | null;
    content: string;
    imageUrl?: string | null;
    displayOrder: number;
    published: boolean;
};

const emptyForm = {
    name: "",
    role: "",
    company: "",
    content: "",
    imageUrl: "",
    displayOrder: 0,
    published: true,
};

export default function TestimonialsAdminPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const getToken = () => localStorage.getItem("adminToken");

    const loadTestimonials = async () => {
        try {
            const response = await fetch(`${API_URL}/api/testimonials/admin`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to load testimonials");
            }

            const data = await response.json();
            setTestimonials(data);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load testimonials.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const url = editingId
                ? `${API_URL}/api/testimonials/${editingId}`
                : `${API_URL}/api/testimonials`;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error("Failed to save testimonial");
            }

            setMessage(
                editingId
                    ? "Testimonial updated successfully."
                    : "Testimonial created successfully."
            );

            setForm(emptyForm);
            setEditingId(null);

            await loadTestimonials();
        } catch (error) {
            console.error(error);
            setMessage("Failed to save testimonial.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingId(testimonial.id);

        setForm({
            name: testimonial.name,
            role: testimonial.role || "",
            company: testimonial.company || "",
            content: testimonial.content,
            imageUrl: testimonial.imageUrl || "",
            displayOrder: testimonial.displayOrder,
            published: testimonial.published,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this testimonial?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/testimonials/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete testimonial");
            }

            setMessage("Testimonial deleted successfully.");

            await loadTestimonials();
        } catch (error) {
            console.error(error);
            setMessage("Failed to delete testimonial.");
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
        setMessage("");
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-6xl px-6 py-12">

                <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                    Admin CMS
                </p>

                <h1 className="mt-4 text-4xl font-bold">
                    Testimonials
                </h1>

                <p className="mt-4 text-gray-400">
                    Create, update and manage client testimonials.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-10 rounded-2xl border border-gray-800 bg-gray-950 p-6"
                >
                    <div className="grid gap-6 md:grid-cols-2">

                        <div>
                            <label className="text-sm text-gray-400">
                                Name
                            </label>

                            <input
                                type="text"
                                value={form.name}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        name: event.target.value,
                                    })
                                }
                                required
                                className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">
                                Role
                            </label>

                            <input
                                type="text"
                                value={form.role}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        role: event.target.value,
                                    })
                                }
                                className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                                placeholder="Software Engineer"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">
                                Company
                            </label>

                            <input
                                type="text"
                                value={form.company}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        company: event.target.value,
                                    })
                                }
                                className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                                placeholder="Company Name"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">
                                Image URL
                            </label>

                            <input
                                type="url"
                                value={form.imageUrl}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        imageUrl: event.target.value,
                                    })
                                }
                                className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">
                                Display Order
                            </label>

                            <input
                                type="number"
                                value={form.displayOrder}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        displayOrder: Number(event.target.value),
                                    })
                                }
                                className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-7">
                            <input
                                id="published"
                                type="checkbox"
                                checked={form.published}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        published: event.target.checked,
                                    })
                                }
                                className="h-4 w-4"
                            />

                            <label
                                htmlFor="published"
                                className="text-sm text-gray-300"
                            >
                                Published
                            </label>
                        </div>

                    </div>

                    <div className="mt-6">
                        <label className="text-sm text-gray-400">
                            Testimonial
                        </label>

                        <textarea
                            value={form.content}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    content: event.target.value,
                                })
                            }
                            required
                            rows={5}
                            className="mt-2 w-full resize-none rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                            placeholder="Write the testimonial..."
                        />
                    </div>

                    <div className="mt-6 flex gap-3">

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Testimonial"
                                    : "Create Testimonial"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="rounded-xl border border-gray-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-gray-500"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                    {message && (
                        <p className="mt-4 text-sm text-gray-400">
                            {message}
                        </p>
                    )}
                </form>

                <section className="mt-12">

                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            Existing Testimonials
                        </h2>

                        <span className="text-sm text-gray-500">
                            {testimonials.length} total
                        </span>
                    </div>

                    {loading ? (
                        <p className="mt-6 text-gray-500">
                            Loading testimonials...
                        </p>
                    ) : testimonials.length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                            <p className="text-gray-500">
                                No testimonials available.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-4">

                            {testimonials
                                .sort(
                                    (a, b) =>
                                        a.displayOrder - b.displayOrder
                                )
                                .map((testimonial) => (
                                    <article
                                        key={testimonial.id}
                                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
                                    >
                                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                                            <div className="flex-1">

                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-xl font-semibold">
                                                        {testimonial.name}
                                                    </h3>

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs ${
                                                            testimonial.published
                                                                ? "bg-green-500/10 text-green-400"
                                                                : "bg-gray-800 text-gray-400"
                                                        }`}
                                                    >
                                                        {testimonial.published
                                                            ? "Published"
                                                            : "Draft"}
                                                    </span>
                                                </div>

                                                {(testimonial.role ||
                                                    testimonial.company) && (
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        {testimonial.role}

                                                        {testimonial.role &&
                                                            testimonial.company &&
                                                            " · "}

                                                        {testimonial.company}
                                                    </p>
                                                )}

                                                <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-300">
                                                    {testimonial.content}
                                                </p>

                                                <p className="mt-4 text-xs text-gray-600">
                                                    Display order:{" "}
                                                    {testimonial.displayOrder}
                                                </p>

                                            </div>

                                            <div className="flex gap-3">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(testimonial)
                                                    }
                                                    className="rounded-xl border border-gray-700 px-4 py-2 text-sm text-white transition hover:border-gray-500"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            testimonial.id
                                                        )
                                                    }
                                                    className="rounded-xl border border-red-900 px-4 py-2 text-sm text-red-400 transition hover:border-red-700"
                                                >
                                                    Delete
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