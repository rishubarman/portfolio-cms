"use client";

import { FormEvent, useEffect, useState } from "react";
import API_URL from "../../../../lib/api";

type Service = {
    id: number;
    title: string;
    description: string;
    iconUrl: string;
    displayOrder: number;
    published: boolean;
};

export default function ServicesAdminPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [displayOrder, setDisplayOrder] = useState(0);
    const [published, setPublished] = useState(true);

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("adminToken")
            : null;

    const loadServices = async () => {
        try {
            const response = await fetch(`${API_URL}/api/services/admin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to load services");
            }

            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setIconUrl("");
        setDisplayOrder(0);
        setPublished(true);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!title.trim()) {
            alert("Service title is required.");
            return;
        }

        setSaving(true);

        const serviceData = {
            title: title.trim(),
            description: description.trim(),
            iconUrl: iconUrl.trim(),
            displayOrder,
            published,
        };

        try {
            const url =
                editingId === null
                    ? `${API_URL}/api/services`
                    : `${API_URL}/api/services/${editingId}`;

            const method = editingId === null ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(serviceData),
            });

            if (!response.ok) {
                throw new Error("Failed to save service");
            }

            await loadServices();
            resetForm();
        } catch (error) {
            console.error(error);
            alert("Failed to save service.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setTitle(service.title);
        setDescription(service.description || "");
        setIconUrl(service.iconUrl || "");
        setDisplayOrder(service.displayOrder ?? 0);
        setPublished(service.published);
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/services/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete service");
            }

            await loadServices();

            if (editingId === id) {
                resetForm();
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete service.");
        }
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-6xl px-6 py-12">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                            Admin CMS
                        </p>

                        <h1 className="mt-3 text-4xl font-bold">
                            Services
                        </h1>

                        <p className="mt-3 text-gray-400">
                            Manage the services displayed on your portfolio.
                        </p>
                    </div>

                    <a
                        href="/admin"
                        className="text-sm text-gray-400 transition hover:text-white"
                    >
                        ← Back to Dashboard
                    </a>
                </div>

                <div className="mt-12 grid gap-10 lg:grid-cols-[380px_1fr]">

                    {/* Form */}
                    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                        <h2 className="text-xl font-semibold">
                            {editingId === null
                                ? "Add Service"
                                : "Edit Service"}
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-5"
                        >
                            <div>
                                <label className="mb-2 block text-sm text-gray-300">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    placeholder="Java Backend Development"
                                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-gray-300">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    placeholder="Describe this service..."
                                    rows={5}
                                    className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-gray-300">
                                    Icon URL
                                </label>

                                <input
                                    type="text"
                                    value={iconUrl}
                                    onChange={(event) =>
                                        setIconUrl(event.target.value)
                                    }
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-gray-300">
                                    Display Order
                                </label>

                                <input
                                    type="number"
                                    value={displayOrder}
                                    onChange={(event) =>
                                        setDisplayOrder(
                                            Number(event.target.value)
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
                                />
                            </div>

                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={published}
                                    onChange={(event) =>
                                        setPublished(event.target.checked)
                                    }
                                    className="h-4 w-4"
                                />

                                <span className="text-sm text-gray-300">
                                    Published
                                </span>
                            </label>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId === null
                                            ? "Add Service"
                                            : "Update Service"}
                                </button>

                                {editingId !== null && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:border-white/30 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </section>

                    {/* Services List */}
                    <section>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                All Services
                            </h2>

                            <span className="text-sm text-gray-500">
                                {services.length}{" "}
                                {services.length === 1
                                    ? "service"
                                    : "services"}
                            </span>
                        </div>

                        {loading ? (
                            <div className="mt-6 rounded-2xl border border-white/10 p-8 text-center text-gray-500">
                                Loading services...
                            </div>
                        ) : services.length === 0 ? (
                            <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-10 text-center">
                                <p className="text-gray-400">
                                    No services added yet.
                                </p>

                                <p className="mt-2 text-sm text-gray-600">
                                    Add your first service using the form.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4">
                                {[...services]
                                    .sort(
                                        (a, b) =>
                                            a.displayOrder -
                                            b.displayOrder
                                    )
                                    .map((service) => (
                                        <article
                                            key={service.id}
                                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                                        >
                                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h3 className="text-lg font-semibold">
                                                            {service.title}
                                                        </h3>

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs ${
                                                                service.published
                                                                    ? "bg-white/10 text-white"
                                                                    : "bg-white/5 text-gray-500"
                                                            }`}
                                                        >
                                                            {service.published
                                                                ? "Published"
                                                                : "Hidden"}
                                                        </span>
                                                    </div>

                                                    {service.description && (
                                                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-400">
                                                            {
                                                                service.description
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
                                                        <span>
                                                            Order:{" "}
                                                            {
                                                                service.displayOrder
                                                            }
                                                        </span>

                                                        {service.iconUrl && (
                                                            <span className="max-w-xs truncate">
                                                                Icon:{" "}
                                                                {
                                                                    service.iconUrl
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(service)
                                                        }
                                                        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-white/30 hover:text-white"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                service.id
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-400 transition hover:border-red-500/40 hover:text-red-300"
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
            </div>
        </main>
    );
}