"use client";

import { FormEvent, useEffect, useState } from "react";

type About = {
    id: number;
    name: string;
    headline: string;
    bio: string;
    location?: string | null;
    profileImageUrl?: string | null;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminAboutPage() {
    const [about, setAbout] = useState<About | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [headline, setHeadline] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadAbout() {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("adminToken");

            if (!token) {
                setError("Please sign in again.");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/about`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load About information");
            }

            const data = await response.json();

            setAbout(data);

            if (data) {
                setName(data.name ?? "");
                setHeadline(data.headline ?? "");
                setBio(data.bio ?? "");
                setLocation(data.location ?? "");
                setProfileImageUrl(
                    data.profileImageUrl ?? ""
                );
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load About information"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAbout();
    }, []);

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

            const payload = {
                name,
                headline,
                bio,
                location,
                profileImageUrl:
                    profileImageUrl || null,
            };

            const url = about
                ? `${API_URL}/api/about/${about.id}`
                : `${API_URL}/api/about`;

            const method = about ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save About information"
                );
            }

            setAbout(data);
            setMessage(
                about
                    ? "About information updated successfully."
                    : "About information created successfully."
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to save About information"
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-5xl px-6 py-12">
                <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                    Admin CMS
                </p>

                <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-bold">
                            About
                        </h1>

                        <p className="mt-3 text-gray-400">
                            Manage your professional profile information.
                        </p>
                    </div>

                    <a
                        href="/admin"
                        className="inline-flex w-fit rounded-xl border border-gray-800 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:text-white"
                    >
                        Back to Dashboard
                    </a>
                </div>

                {loading ? (
                    <p className="mt-10 text-gray-500">
                        Loading About information...
                    </p>
                ) : (
                    <section className="mt-10 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold">
                                {about
                                    ? "Edit About Information"
                                    : "Create About Information"}
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                This information will be used on your public
                                portfolio.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Name
                                </label>

                                <input
                                    id="name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    required
                                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="headline"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Headline
                                </label>

                                <input
                                    id="headline"
                                    value={headline}
                                    onChange={(event) =>
                                        setHeadline(event.target.value)
                                    }
                                    required
                                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="bio"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Bio
                                </label>

                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(event) =>
                                        setBio(event.target.value)
                                    }
                                    required
                                    rows={7}
                                    className="w-full resize-none rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="location"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Location
                                </label>

                                <input
                                    id="location"
                                    value={location}
                                    onChange={(event) =>
                                        setLocation(event.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-gray-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="profileImageUrl"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Profile Image URL
                                </label>

                                <input
                                    id="profileImageUrl"
                                    type="url"
                                    value={profileImageUrl}
                                    onChange={(event) =>
                                        setProfileImageUrl(
                                            event.target.value
                                        )
                                    }
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-500"
                                />
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
                                    : about
                                        ? "Update About"
                                        : "Create About"}
                            </button>
                        </form>
                    </section>
                )}
            </div>
        </main>
    );
}