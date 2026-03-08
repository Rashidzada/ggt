import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { CourseCard } from "../components/CourseCard";
import { LoadingBlock } from "../components/LoadingBlock";
import { SectionHeading } from "../components/SectionHeading";
import { api, extractResults } from "../lib/api";
import type { Course, CourseCategory } from "../types/api";

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [courseResponse, categoryResponse] = await Promise.all([
          api.get("/courses/"),
          api.get("/courses/categories/"),
        ]);
        setCourses(extractResults<Course>(courseResponse.data));
        setCategories(extractResults<CourseCategory>(categoryResponse.data));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  if (isLoading) {
    return <LoadingBlock label="Loading course catalog..." />;
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.short_description.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    const matchesCategory = selectedCategory === "all" || course.category.slug === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="space-y-10">
      <section className="glass-panel rounded-[36px] px-6 py-10 sm:px-10">
        <SectionHeading
          eyebrow="Courses"
          title="Browse published tracks, trial lessons, and pricing models"
          description="Courses are kept simple: clear outcomes, preview access, optional quoted pricing, and direct application to the owner."
        />
        <div className="mt-8 grid gap-4 rounded-[28px] bg-white/75 p-5 md:grid-cols-[1.4fr_1fr_1fr]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses"
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-11 py-3 text-sm outline-none ring-0"
            />
          </label>
          <label className="relative">
            <Filter className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
            <select
              value={selectedLevel}
              onChange={(event) => setSelectedLevel(event.target.value)}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-11 py-3 text-sm outline-none"
            >
              <option value="all">All levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>
    </div>
  );
}
