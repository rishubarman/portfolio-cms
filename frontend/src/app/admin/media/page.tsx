"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API_URL from "../../../../lib/api";

type Media = {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
};

export default function MediaPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState("");
    const [error, setError] = useState("");
    const [media, setMedia] = useState<Media[]>([]);
    const [loadingMedia, setLoadingMedia] = useState(true);

    const loadMedia = async () => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Authentication token not found.");
            setLoadingMedia(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/upload/media`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load media.");
            }

            const data = await response.json();
            setMedia(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load media."
            );
        } finally {
            setLoadingMedia(false);
        }
    };

    useEffect(() => {
        loadMedia();
    }, []);

    const handleUpload = async () => {
        if (!file) {
            setError("Please select an image first.");
            return;
        }

        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Authentication token not found.");
            return;
        }

        setUploading(true);
        setError("");
        setUploadedUrl("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(
                `${API_URL}/api/upload/image`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Upload failed.");
            }

            const data = await response.json();

            setUploadedUrl(`${API_URL}${data.fileUrl}`);
            setFile(null);

            await loadMedia();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmed) {
            return;
        }

        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Authentication token not found.");
            return;
        }

        setDeletingId(id);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/api/upload/media/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete media.");
            }

            setMedia((currentMedia) =>
                currentMedia.filter(
                    (item) => item.id !== id
                )
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete media."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const formatFileSize = (size: number) => {
        if (size < 1024) {
            return `${size} B`;
        }

        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-6xl px-6 py-14">

                {/* Header */}
                <div className="mb-12 flex items-start justify-between gap-6">
                    <div>
                        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
                            Admin CMS
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight">
                            Media
                        </h1>

                        <p className="mt-4 text-base text-slate-400">
                            Upload and manage images for your portfolio.
                        </p>
                    </div>

                    <Link
                        href="/admin"
                        className="rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Upload Card */}
                <section className="rounded-2xl border border-slate-800 bg-[#030712] p-8 shadow-2xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">
                            Upload Image
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Upload an image to use across your portfolio.
                        </p>
                    </div>

                    <div className="space-y-6">

                        {/* File Input */}
                        <div>
                            <label className="mb-3 block text-sm font-medium text-slate-300">
                                Select Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    setFile(
                                        event.target.files?.[0] || null
                                    );
                                    setError("");
                                    setUploadedUrl("");
                                }}
                                className="block w-full cursor-pointer rounded-xl border border-slate-800 bg-black px-4 py-4 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:border-slate-600"
                            />
                        </div>

                        {/* Selected File */}
                        {file && (
                            <div className="rounded-xl border border-slate-800 bg-black p-4">
                                <p className="text-xs uppercase tracking-wider text-slate-500">
                                    Selected file
                                </p>

                                <p className="mt-2 break-all text-sm text-slate-300">
                                    {file.name}
                                </p>

                                <p className="mt-1 text-xs text-slate-600">
                                    {formatFileSize(file.size)}
                                </p>
                            </div>
                        )}

                        {/* Upload Button */}
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={uploading}
                            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {uploading
                                ? "Uploading..."
                                : "Upload Image"}
                        </button>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3">
                                <p className="text-sm text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Latest Upload */}
                        {uploadedUrl && (
                            <div className="border-t border-slate-800 pt-8">
                                <div className="mb-5">
                                    <p className="text-sm font-semibold text-green-400">
                                        Image uploaded successfully
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Your image is now available through the media server.
                                    </p>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black p-4">
                                    <img
                                        src={uploadedUrl}
                                        alt="Uploaded media"
                                        className="mx-auto max-h-[500px] rounded-xl object-contain"
                                    />
                                </div>

                                <div className="mt-4 rounded-xl border border-slate-800 bg-black p-4">
                                    <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">
                                        Image URL
                                    </p>

                                    <p className="break-all text-sm text-slate-400">
                                        {uploadedUrl}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Media Library */}
                <section className="mt-10">
                    <div className="mb-6 flex items-end justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                                Library
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold">
                                Uploaded Media
                            </h2>
                        </div>

                        <p className="text-sm text-slate-500">
                            {media.length}{" "}
                            {media.length === 1 ? "file" : "files"}
                        </p>
                    </div>

                    {loadingMedia ? (
                        <div className="rounded-2xl border border-slate-800 bg-[#030712] p-8 text-center">
                            <p className="text-sm text-slate-500">
                                Loading media...
                            </p>
                        </div>
                    ) : media.length === 0 ? (
                        <div className="rounded-2xl border border-slate-800 bg-[#030712] p-12 text-center">
                            <p className="text-slate-400">
                                No media uploaded yet.
                            </p>

                            <p className="mt-2 text-sm text-slate-600">
                                Upload your first image above.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {media.map((item) => (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-2xl border border-slate-800 bg-[#030712] transition hover:border-slate-600"
                                >
                                    {/* Image */}
                                    <div className="flex h-64 items-center justify-center overflow-hidden bg-black p-4">
                                        <img
                                            src={`${API_URL}${item.fileUrl}`}
                                            alt={item.fileName}
                                            className="h-full w-full rounded-xl object-contain"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="border-t border-slate-800 p-5">
                                        <p className="truncate text-sm font-medium text-white">
                                            {item.fileName}
                                        </p>

                                        <div className="mt-3 space-y-1">
                                            <p className="text-xs text-slate-500">
                                                Type:{" "}
                                                <span className="text-slate-400">
                                                    {item.fileType}
                                                </span>
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Size:{" "}
                                                <span className="text-slate-400">
                                                    {formatFileSize(
                                                        item.fileSize
                                                    )}
                                                </span>
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                ID:{" "}
                                                <span className="text-slate-400">
                                                    #{item.id}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="mt-4 rounded-lg border border-slate-800 bg-black p-3">
                                            <p className="break-all text-xs text-slate-500">
                                                {API_URL}
                                                {item.fileUrl}
                                            </p>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            disabled={
                                                deletingId === item.id
                                            }
                                            className="mt-4 w-full rounded-xl border border-red-900/60 px-4 py-3 text-sm font-medium text-red-400 transition hover:border-red-700 hover:bg-red-950/30 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {deletingId === item.id
                                                ? "Deleting..."
                                                : "Delete Image"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}