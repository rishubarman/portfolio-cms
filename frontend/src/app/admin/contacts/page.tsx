"use client";

import { useEffect, useState } from "react";

type Contact = {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [readingId, setReadingId] = useState<number | null>(null);

    async function loadContacts() {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("adminToken");

            if (!token) {
                setError("Please sign in again.");
                return;
            }

            const response = await fetch(`${API_URL}/api/contacts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load contact messages."
                );
            }

            setContacts(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load contact messages."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadContacts();
    }, []);

    async function handleMarkAsRead(id: number) {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Please sign in again.");
            return;
        }

        try {
            setReadingId(id);
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/api/contacts/${id}/read`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to mark message as read."
                );
            }

            setContacts((currentContacts) =>
                currentContacts.map((contact) =>
                    contact.id === id
                        ? { ...contact, read: true }
                        : contact
                )
            );

            setMessage("Message marked as read.");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to mark message as read."
            );
        } finally {
            setReadingId(null);
        }
    }

    async function handleDelete(id: number) {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Please sign in again.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/api/contacts/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                let errorMessage = "Failed to delete message.";

                try {
                    const data = await response.json();

                    if (data.message) {
                        errorMessage = data.message;
                    }
                } catch {
                    // Empty response is acceptable for DELETE.
                }

                throw new Error(errorMessage);
            }

            setContacts((currentContacts) =>
                currentContacts.filter(
                    (contact) => contact.id !== id
                )
            );

            setMessage("Message deleted successfully.");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete message."
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
                            Contact Messages
                        </h1>

                        <p className="mt-3 text-gray-400">
                            View and manage messages submitted through your
                            portfolio.
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
                    <p className="mt-8 rounded-xl border border-green-900 bg-green-950/30 px-4 py-3 text-sm text-green-400">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="mt-8 rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="mt-10 text-gray-500">
                        Loading contact messages...
                    </p>
                ) : contacts.length === 0 ? (
                    <section className="mt-10 rounded-2xl border border-gray-800 bg-gray-950 p-10 text-center">
                        <h2 className="text-2xl font-semibold">
                            No messages yet
                        </h2>

                        <p className="mt-3 text-gray-500">
                            Messages submitted through your portfolio will
                            appear here.
                        </p>
                    </section>
                ) : (
                    <section className="mt-10 space-y-6">
                        {contacts.map((contact) => (
                            <article
                                key={contact.id}
                                className={`rounded-2xl border bg-gray-950 p-7 ${
                                    contact.read
                                        ? "border-gray-800"
                                        : "border-gray-600"
                                }`}
                            >
                                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-2xl font-semibold">
                                                {contact.subject}
                                            </h2>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs ${
                                                    contact.read
                                                        ? "border-gray-800 text-gray-500"
                                                        : "border-gray-600 text-white"
                                                }`}
                                            >
                        {contact.read ? "Read" : "New"}
                      </span>
                                        </div>

                                        <div className="mt-4 space-y-1 text-sm text-gray-400">
                                            <p>
                        <span className="text-gray-500">
                          From:
                        </span>{" "}
                                                {contact.name}
                                            </p>

                                            <p>
                        <span className="text-gray-500">
                          Email:
                        </span>{" "}
                                                <a
                                                    href={`mailto:${contact.email}`}
                                                    className="text-gray-300 underline underline-offset-4 hover:text-white"
                                                >
                                                    {contact.email}
                                                </a>
                                            </p>

                                            <p className="text-gray-600">
                                                {new Date(
                                                    contact.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {!contact.read && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleMarkAsRead(contact.id)
                                                }
                                                disabled={readingId === contact.id}
                                                className="rounded-xl border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {readingId === contact.id
                                                    ? "Updating..."
                                                    : "Mark as Read"}
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(contact.id)
                                            }
                                            disabled={deletingId === contact.id}
                                            className="rounded-xl border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition hover:border-red-700 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {deletingId === contact.id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-7 rounded-xl border border-gray-800 bg-black p-5">
                                    <p className="whitespace-pre-wrap leading-7 text-gray-300">
                                        {contact.message}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}