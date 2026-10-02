"use client";

export default function AdminPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-6xl px-6 py-12">

                <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                        Admin CMS
                    </p>

                    <h1 className="mt-4 text-4xl font-bold">
                        Portfolio Dashboard
                    </h1>

                    <p className="mt-4 text-gray-400">
                        Manage your portfolio content from one place.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {/* Projects */}
                    <a
                        href="/admin/projects"
                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-600"
                    >
                        <p className="text-sm text-gray-500">
                            Projects
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            Manage
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Create, update and delete portfolio projects.
                        </p>
                    </a>

                    {/* About */}
                    <a
                        href="/admin/about"
                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-600"
                    >
                        <p className="text-sm text-gray-500">
                            About
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            Manage
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Manage your profile and professional information.
                        </p>
                    </a>

                    {/* Skills */}
                    <a
                        href="/admin/skills"
                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-600"
                    >
                        <p className="text-sm text-gray-500">
                            Skills
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            Manage
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Create, update and organize your technical skills.
                        </p>
                    </a>

                    {/* Experience */}
                    <a
                        href="/admin/experience"
                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-600"
                    >
                        <p className="text-sm text-gray-500">
                            Experience
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            Manage
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Create, update and organize your professional experience.
                        </p>
                    </a>

                    {/* Blogs */}
                    <a
                        href="/admin/blogs"
                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-600"
                    >
                        <p className="text-sm text-gray-500">
                            Blogs
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            Manage
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Create, update and manage your portfolio blog posts.
                        </p>
                    </a>

                    {/* Testimonials */}
                    <a
                        href="/admin/testimonials"
                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-600"
                    >
                        <p className="text-sm text-gray-500">
                            Testimonials
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            Manage
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Create, update and manage client testimonials.
                        </p>
                    </a>

                    {/* Services */}
                    <a
                        href="/admin/services"
                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-600"
                    >
                        <p className="text-sm text-gray-500">
                            Services
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            Manage
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Create, update and manage your professional services.
                        </p>
                    </a>

                    {/* Media */}
                    <a
                        href="/admin/media"
                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-600"
                    >
                        <p className="text-sm text-gray-500">
                            Media
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            Manage
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Upload and manage images used across your portfolio.
                        </p>
                    </a>

                    {/* Contact */}
                    <a
                        href="/admin/contacts"
                        className="rounded-2xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-600"
                    >
                        <p className="text-sm text-gray-500">
                            Contact
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            Messages
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            View messages submitted through your portfolio.
                        </p>
                    </a>

                </div>
            </div>
        </main>
    );
}