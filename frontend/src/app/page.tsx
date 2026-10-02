"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

type Project = {
    id: number;
    title: string;
    description: string;
    shortDescription?: string;
    imageUrl?: string | null;
    githubUrl?: string | null;
    liveUrl?: string | null;
    techStack?: string;
    featured: boolean;
    published: boolean;
    displayOrder?: number;
};

type About = {
    id: number;
    name: string;
    headline: string;
    bio: string;
    location?: string | null;
    profileImageUrl?: string | null;
};

type Skill = {
    id: number;
    name: string;
    category?: string | null;
    iconUrl?: string | null;
    displayOrder: number;
    published: boolean;
};

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

type Service = {
    id: number;
    title: string;
    description?: string | null;
    iconUrl?: string | null;
    displayOrder: number;
    published: boolean;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Home() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [about, setAbout] = useState<About | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactSubject, setContactSubject] = useState("");
    const [contactMessage, setContactMessage] = useState("");

    const [contactLoading, setContactLoading] = useState(false);
    const [contactSuccess, setContactSuccess] = useState("");
    const [contactError, setContactError] = useState("");

    useEffect(() => {
        async function loadPortfolioData() {
            try {
                const [
                    projectsResponse,
                    aboutResponse,
                    skillsResponse,
                    experiencesResponse,
                    testimonialsResponse,
                    servicesResponse,
                    blogsResponse,
                ] = await Promise.all([
                    fetch(`${API_URL}/api/projects`),
                    fetch(`${API_URL}/api/about`),
                    fetch(`${API_URL}/api/skills`),
                    fetch(`${API_URL}/api/experience`),
                    fetch(`${API_URL}/api/testimonials`),
                    fetch(`${API_URL}/api/services`),
                    fetch(`${API_URL}/api/blogs`),
                ]);

                if (projectsResponse.ok) {
                    const projectsData = await projectsResponse.json();
                    setProjects(projectsData);
                }

                if (aboutResponse.ok) {
                    const aboutData = await aboutResponse.json();
                    setAbout(aboutData);
                }

                if (skillsResponse.ok) {
                    const skillsData = await skillsResponse.json();
                    setSkills(skillsData);
                }

                if (experiencesResponse.ok) {
                    const experiencesData =
                        await experiencesResponse.json();

                    setExperiences(experiencesData);
                }

                if (testimonialsResponse.ok) {
                    const testimonialsData =
                        await testimonialsResponse.json();

                    setTestimonials(testimonialsData);
                }

                if (servicesResponse.ok) {
                    const servicesData =
                        await servicesResponse.json();

                    setServices(servicesData);
                }

                if (blogsResponse.ok) {
                    const blogsData = await blogsResponse.json();
                    setBlogs(blogsData);
                }
            } catch {
                setProjects([]);
                setAbout(null);
                setSkills([]);
                setExperiences([]);
                setTestimonials([]);
                setServices([]);
                setBlogs([]);
            }
        }

        loadPortfolioData();
    }, []);

    const publishedProjects = projects
        .filter((project) => project.published)
        .sort(
            (a, b) =>
                (a.displayOrder ?? 0) -
                (b.displayOrder ?? 0)
        );

    const publishedSkills = skills
        .filter((skill) => skill.published)
        .sort(
            (a, b) =>
                (a.displayOrder ?? 0) -
                (b.displayOrder ?? 0)
        );

    const publishedExperiences = experiences
        .filter((experience) => experience.published)
        .sort(
            (a, b) =>
                (a.displayOrder ?? 0) -
                (b.displayOrder ?? 0)
        );

    const publishedTestimonials = testimonials
        .filter((testimonial) => testimonial.published)
        .sort(
            (a, b) =>
                (a.displayOrder ?? 0) -
                (b.displayOrder ?? 0)
        );

    const publishedServices = services
        .filter((service) => service.published)
        .sort(
            (a, b) =>
                (a.displayOrder ?? 0) -
                (b.displayOrder ?? 0)
        );

    const publishedBlogs = blogs
        .filter((blog) => blog.published)
        .sort((a, b) => {
            const dateA = a.publishedAt
                ? new Date(a.publishedAt).getTime()
                : 0;

            const dateB = b.publishedAt
                ? new Date(b.publishedAt).getTime()
                : 0;

            return dateB - dateA;
        });

    function formatExperienceDate(date: string) {
        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                year: "numeric",
                month: "short",
            }
        );
    }

    async function handleContactSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setContactLoading(true);
        setContactSuccess("");
        setContactError("");

        try {
            const response = await fetch(`${API_URL}/api/contacts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: contactName,
                    email: contactEmail,
                    subject: contactSubject,
                    message: contactMessage,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to send your message."
                );
            }

            setContactSuccess(
                "Your message has been sent successfully."
            );

            setContactName("");
            setContactEmail("");
            setContactSubject("");
            setContactMessage("");
        } catch (error) {
            setContactError(
                error instanceof Error
                    ? error.message
                    : "Failed to send your message."
            );
        } finally {
            setContactLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-black text-white">

            {/* Navigation */}
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">

                <div className="w-8" />

                <div className="hidden gap-8 text-sm text-gray-300 md:flex">

                    <a
                        href="#about"
                        className="transition hover:text-white"
                    >
                        About
                    </a>

                    <a
                        href="#skills"
                        className="transition hover:text-white"
                    >
                        Skills
                    </a>

                    <a
                        href="#services"
                        className="transition hover:text-white"
                    >
                        Services
                    </a>

                    <a
                        href="#experience"
                        className="transition hover:text-white"
                    >
                        Experience
                    </a>

                    <a
                        href="#projects"
                        className="transition hover:text-white"
                    >
                        Projects
                    </a>

                    <a
                        href="#testimonials"
                        className="transition hover:text-white"
                    >
                        Testimonials
                    </a>

                    <a
                        href="#blog"
                        className="transition hover:text-white"
                    >
                        Blog
                    </a>

                    <a
                        href="#contact"
                        className="transition hover:text-white"
                    >
                        Contact
                    </a>

                </div>
            </nav>

            {/* Hero */}
            <section className="mx-auto flex min-h-[80vh] max-w-6xl items-center px-6">

                <div className="max-w-3xl">

                    <p className="mb-4 text-base font-medium uppercase tracking-[0.3em] text-gray-400">
                        {about?.headline || "ASPIRING JAVA DEVELOPER"}
                    </p>

                    <h2 className="text-5xl font-extrabold tracking-tight leading-tight md:text-8xl">
                        {about?.name || "Rishu Barman"}
                    </h2>

                    <p className="mt-6 max-w-2xl text-xl leading-8 text-gray-400">
                        {about?.bio ||
                            "I'm Rishu Barman, a Computer Science graduate passionate about Java, Spring Boot, backend development, and solving real-world problems with software."}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">

                        <a
                            href="#projects"
                            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                        >
                            View Projects
                        </a>

                        <a
                            href="#contact"
                            className="rounded-full border border-gray-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-gray-500 hover:bg-gray-900"
                        >
                            Contact Me
                        </a>

                    </div>

                </div>

            </section>

            {/* About */}
            <section
                id="about"
                className="border-t border-gray-900"
            >

                <div className="mx-auto max-w-6xl px-6 py-24">

                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                        About
                    </p>

                    <h3 className="mt-4 text-3xl font-bold md:text-4xl">
                        {about?.headline ||
                            "Developer focused on backend engineering."}
                    </h3>

                    <p className="mt-6 max-w-3xl leading-8 text-gray-400">
                        {about?.bio ||
                            "I work primarily with Java and Spring Boot, with experience building REST APIs, authentication systems, database-driven applications, and full-stack projects."}
                    </p>

                    {about?.location && (
                        <p className="mt-5 text-sm text-gray-500">
                            Based in {about.location}
                        </p>
                    )}

                </div>

            </section>

            {/* Skills */}
            <section
                id="skills"
                className="border-t border-gray-900"
            >

                <div className="mx-auto max-w-6xl px-6 py-24">

                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                        Skills
                    </p>

                    <h3 className="mt-4 text-3xl font-bold md:text-4xl">
                        Technologies I work with
                    </h3>

                    {publishedSkills.length === 0 ? (

                        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                            <p className="text-gray-400">
                                No published skills available.
                            </p>
                        </div>

                    ) : (

                        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            {publishedSkills.map((skill) => (

                                <article
                                    key={skill.id}
                                    className="rounded-2xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-600"
                                >

                                    <div className="flex items-center gap-4">

                                        {skill.iconUrl ? (

                                            <Image
                                                src={skill.iconUrl}
                                                alt={`${skill.name} icon`}
                                                width={40}
                                                height={40}
                                                className="h-10 w-10 object-contain"
                                            />

                                        ) : (

                                            <div
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 text-sm font-semibold text-gray-400">
                                                {skill.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                        )}

                                        <div>

                                            <h4 className="text-lg font-semibold">
                                                {skill.name}
                                            </h4>

                                            {skill.category && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {skill.category}
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </section>

            {/* Services */}
            <section
                id="services"
                className="border-t border-gray-900"
            >

                <div className="mx-auto max-w-6xl px-6 py-24">

                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                        Services
                    </p>

                    <h3 className="mt-4 text-3xl font-bold md:text-4xl">
                        What I can help you build
                    </h3>

                    {publishedServices.length === 0 ? (

                        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                            <p className="text-gray-400">
                                No published services available.
                            </p>
                        </div>

                    ) : (

                        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {publishedServices.map((service) => (

                                <article
                                    key={service.id}
                                    className="rounded-2xl border border-gray-800 bg-gray-950 p-7 transition hover:border-gray-600"
                                >

                                    <div className="flex items-start gap-4">

                                        {service.iconUrl ? (

                                            <Image
                                                src={service.iconUrl}
                                                alt={`${service.title} icon`}
                                                width={48}
                                                height={48}
                                                className="h-12 w-12 rounded-xl object-contain"
                                            />

                                        ) : (

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-800 text-lg font-semibold text-gray-400">
                                                {service.title
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                        )}

                                        <div>

                                            <h4 className="text-xl font-semibold">
                                                {service.title}
                                            </h4>

                                        </div>

                                    </div>

                                    {service.description && (

                                        <p className="mt-6 leading-7 text-gray-400">
                                            {service.description}
                                        </p>

                                    )}

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </section>

            {/* Experience */}
            <section
                id="experience"
                className="border-t border-gray-900"
            >

                <div className="mx-auto max-w-6xl px-6 py-24">

                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                        Experience
                    </p>

                    <h3 className="mt-4 text-3xl font-bold md:text-4xl">
                        Professional journey
                    </h3>

                    {publishedExperiences.length === 0 ? (

                        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                            <p className="text-gray-400">
                                No published experience available.
                            </p>
                        </div>

                    ) : (

                        <div className="mt-12 space-y-6">

                            {publishedExperiences.map((experience) => (

                                <article
                                    key={experience.id}
                                    className="rounded-2xl border border-gray-800 bg-gray-950 p-7 transition hover:border-gray-600"
                                >

                                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">

                                        <div>

                                            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                                                {experience.company}
                                            </p>

                                            <h4 className="mt-2 text-2xl font-semibold">
                                                {experience.role}
                                            </h4>

                                            {experience.location && (
                                                <p className="mt-2 text-sm text-gray-500">
                                                    {experience.location}
                                                </p>
                                            )}

                                            <p className="mt-3 text-sm text-gray-500">
                                                {formatExperienceDate(
                                                    experience.startDate
                                                )}
                                                {" — "}
                                                {experience.current
                                                    ? "Present"
                                                    : experience.endDate
                                                        ? formatExperienceDate(
                                                            experience.endDate
                                                        )
                                                        : "N/A"}
                                            </p>

                                        </div>

                                        <span
                                            className="w-fit rounded-full border border-gray-800 px-3 py-1 text-xs text-gray-500">
                                            {String(
                                                experience.displayOrder
                                            ).padStart(2, "0")}
                                        </span>

                                    </div>

                                    {experience.description && (
                                        <p className="mt-6 max-w-3xl whitespace-pre-wrap leading-8 text-gray-400">
                                            {experience.description}
                                        </p>
                                    )}

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </section>

            {/* Projects */}
            <section
                id="projects"
                className="border-t border-gray-900"
            >

                <div className="mx-auto max-w-6xl px-6 py-24">

                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                        Projects
                    </p>

                    <h3 className="mt-4 text-3xl font-bold md:text-4xl">
                        Selected work
                    </h3>

                    {publishedProjects.length === 0 ? (

                        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                            <p className="text-gray-400">
                                No published projects available.
                            </p>
                        </div>

                    ) : (

                        <div className="mt-12 grid gap-6 md:grid-cols-2">

                            {publishedProjects.map((project) => (

                                <article
                                    key={project.id}
                                    className="rounded-2xl border border-gray-800 bg-gray-950 p-7"
                                >

                                    <p className="text-sm text-gray-500">
                                        {String(
                                            project.displayOrder ?? 0
                                        ).padStart(2, "0")}
                                    </p>

                                    <h4 className="mt-4 text-2xl font-semibold">
                                        {project.title}
                                    </h4>

                                    <p className="mt-4 leading-7 text-gray-400">
                                        {project.shortDescription ||
                                            project.description}
                                    </p>

                                    {project.techStack && (

                                        <div className="mt-6 flex flex-wrap gap-2">

                                            {project.techStack
                                                .split(",")
                                                .map((tech) => (

                                                    <span
                                                        key={tech.trim()}
                                                        className="rounded-full border border-gray-800 px-3 py-1 text-xs text-gray-400"
                                                    >
                                                        {tech.trim()}
                                                    </span>

                                                ))}

                                        </div>

                                    )}

                                    {(project.githubUrl ||
                                        project.liveUrl) && (

                                        <div className="mt-7 flex gap-4">

                                            {project.githubUrl && (

                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-white underline underline-offset-4 hover:text-gray-300"
                                                >
                                                    GitHub
                                                </a>

                                            )}

                                            {project.liveUrl && (

                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-white underline underline-offset-4 hover:text-gray-300"
                                                >
                                                    Live Demo
                                                </a>

                                            )}

                                        </div>

                                    )}

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </section>

            {/* Testimonials */}
            <section
                id="testimonials"
                className="border-t border-gray-900"
            >

                <div className="mx-auto max-w-6xl px-6 py-24">

                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                        Testimonials
                    </p>

                    <h3 className="mt-4 text-3xl font-bold md:text-4xl">
                        What people say
                    </h3>

                    {publishedTestimonials.length === 0 ? (

                        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                            <p className="text-gray-400">
                                No published testimonials available.
                            </p>
                        </div>

                    ) : (

                        <div className="mt-12 grid gap-6 md:grid-cols-2">

                            {publishedTestimonials.map((testimonial) => (

                                <article
                                    key={testimonial.id}
                                    className="rounded-2xl border border-gray-800 bg-gray-950 p-7 transition hover:border-gray-600"
                                >

                                    <div className="flex items-start gap-5">

                                        {testimonial.imageUrl ? (

                                            <Image
                                                src={testimonial.imageUrl}
                                                alt={testimonial.name}
                                                width={56}
                                                height={56}
                                                className="h-14 w-14 rounded-full object-cover"
                                            />

                                        ) : (

                                            <div
                                                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gray-800 text-lg font-semibold text-gray-400">
                                                {testimonial.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                        )}

                                        <div className="min-w-0">

                                            <h4 className="text-xl font-semibold">
                                                {testimonial.name}
                                            </h4>

                                            {(testimonial.role ||
                                                testimonial.company) && (

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {testimonial.role}

                                                    {testimonial.role &&
                                                        testimonial.company &&
                                                        " · "}

                                                    {testimonial.company}
                                                </p>

                                            )}

                                        </div>

                                    </div>

                                    <p className="mt-6 whitespace-pre-wrap leading-8 text-gray-400">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p>

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </section>

            {/* Blog */}
            <section
                id="blog"
                className="border-t border-gray-900"
            >

                <div className="mx-auto max-w-6xl px-6 py-24">

                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                        Blog
                    </p>

                    <h3 className="mt-4 text-3xl font-bold md:text-4xl">
                        Thoughts & insights
                    </h3>

                    {publishedBlogs.length === 0 ? (

                        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-950 p-8">
                            <p className="text-gray-400">
                                No published blog posts available.
                            </p>
                        </div>

                    ) : (

                        <div className="mt-12 grid gap-6 md:grid-cols-2">

                            {publishedBlogs.map((blog) => (

                                <article
                                    key={blog.id}
                                    className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 transition hover:border-gray-600"
                                >

                                    {blog.coverImageUrl && (

                                        <Image
                                            src={blog.coverImageUrl}
                                            alt={blog.title}
                                            width={800}
                                            height={416}
                                            className="h-52 w-full object-cover"
                                        />

                                    )}

                                    <div className="p-7">

                                        <div className="flex flex-wrap items-center gap-3">

                                            {blog.featured && (

                                                <span
                                                    className="rounded-full border border-yellow-900 px-3 py-1 text-xs text-yellow-500">
                                                    Featured
                                                </span>

                                            )}

                                            {blog.publishedAt && (

                                                <span className="text-xs text-gray-600">
                                                    {new Date(
                                                        blog.publishedAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </span>

                                            )}

                                        </div>

                                        <h4 className="mt-4 text-2xl font-semibold">
                                            {blog.title}
                                        </h4>

                                        {blog.excerpt && (

                                            <p className="mt-4 leading-7 text-gray-400">
                                                {blog.excerpt}
                                            </p>

                                        )}

                                        <a
                                            href={`/blog/${blog.slug}`}
                                            className="mt-6 inline-block text-sm font-medium text-white underline underline-offset-4 transition hover:text-gray-300"
                                        >
                                            Read Article
                                        </a>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </section>

            {/* Contact */}
            <section
                id="contact"
                className="border-t border-gray-900"
            >

                <div className="mx-auto max-w-6xl px-6 py-24">

                    <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                        Contact
                    </p>

                    <h3 className="mt-4 text-3xl font-bold md:text-4xl">
                        Let&apos;s build something.
                    </h3>

                    <p className="mt-6 max-w-2xl text-gray-400">
                        Have a project, opportunity, or question? Send me
                        a message and I&apos;ll get back to you.
                    </p>

                    <form
                        onSubmit={handleContactSubmit}
                        className="mt-10 max-w-2xl space-y-6"
                    >

                        <div>

                            <label
                                htmlFor="contact-name"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Name
                            </label>

                            <input
                                id="contact-name"
                                type="text"
                                value={contactName}
                                onChange={(event) =>
                                    setContactName(event.target.value)
                                }
                                placeholder="Your name"
                                required
                                maxLength={100}
                                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />

                        </div>

                        <div>

                            <label
                                htmlFor="contact-email"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Email
                            </label>

                            <input
                                id="contact-email"
                                type="email"
                                value={contactEmail}
                                onChange={(event) =>
                                    setContactEmail(event.target.value)
                                }
                                placeholder="you@example.com"
                                required
                                maxLength={255}
                                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />

                        </div>

                        <div>

                            <label
                                htmlFor="contact-subject"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Subject
                            </label>

                            <input
                                id="contact-subject"
                                type="text"
                                value={contactSubject}
                                onChange={(event) =>
                                    setContactSubject(event.target.value)
                                }
                                placeholder="What would you like to discuss?"
                                required
                                maxLength={255}
                                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />

                        </div>

                        <div>

                            <label
                                htmlFor="contact-message"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Message
                            </label>

                            <textarea
                                id="contact-message"
                                value={contactMessage}
                                onChange={(event) =>
                                    setContactMessage(event.target.value)
                                }
                                placeholder="Write your message..."
                                required
                                maxLength={2000}
                                rows={6}
                                className="w-full resize-none rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
                            />

                        </div>

                        {contactSuccess && (

                            <p className="rounded-xl border border-green-900 bg-green-950/30 px-4 py-3 text-sm text-green-400">
                                {contactSuccess}
                            </p>

                        )}

                        {contactError && (

                            <p className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                                {contactError}
                            </p>

                        )}

                        <button
                            type="submit"
                            disabled={contactLoading}
                            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {contactLoading
                                ? "Sending..."
                                : "Send Message"}
                        </button>

                    </form>

                </div>

            </section>

            {/* Footer */}
            <footer className="border-t border-gray-900 px-6 py-8 text-center text-sm text-gray-500">
                © 2026 {about?.name || "Rishu Barman"}. All rights reserved.
            </footer>

        </main>
    );
}