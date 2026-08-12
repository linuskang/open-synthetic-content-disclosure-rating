"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { RatingTable } from "./components/rating-table";
import {
  allRatings,
  getRatingSentence,
  questions,
  type Frequency,
  type RatingCode,
  type Role,
  type Type,
} from "./rating-data";

export default function Home() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const quizRef = useRef<HTMLDivElement>(null);
  const [ratingPage, setRatingPage] = useState(0);

  const rating = useMemo<RatingCode | null>(() => {
    if (answers.used === "no") return "AAA";
    if (answers.used !== "yes") return null;
    if (!answers.frequency || !answers.role || !answers.type) return null;
    return `${answers.frequency as Frequency}${answers.role as Role}${answers.type as Type}`;
  }, [answers]);

  const currentQuestionIndex = useMemo(() => {
    if (!answers.used) return 0;
    if (answers.used === "no") return 0;
    if (!answers.frequency) return 1;
    if (!answers.role) return 2;
    if (!answers.type) return 3;
    return 3;
  }, [answers]);

  const visibleQuestions = useMemo(() => {
    if (answers.used === "no") return [questions[0]];
    return questions.slice(0, currentQuestionIndex + 1);
  }, [answers, currentQuestionIndex]);

  function handleChange(questionId: string, value: string) {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      if (questionId === "used") {
        delete next.frequency;
        delete next.role;
        delete next.type;
      }
      if (questionId === "frequency") {
        delete next.role;
        delete next.type;
      }
      if (questionId === "role") {
        delete next.type;
      }
      return next;
    });
  }

  function reset() {
    setAnswers({});
  }

  function scrollToQuiz() {
    quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Open Synthetic Content Disclosure Rating
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed text-neutral-700 mb-8 max-w-2xl">
          A simple, three-letter label that tells people how AI was used to make
          your content.
        </p>

        <Image
          src="/banner.png"
          alt="Open Synthetic Content Disclosure Rating banner"
          width={896}
          height={448}
          priority
          className="w-full mb-7"
        />

        <button
          onClick={scrollToQuiz}
          className="inline-flex items-center px-5 py-2.5 bg-neutral-900 text-white text-base font-medium rounded-lg hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 mb-16"
        >
          Take the questionnaire
        </button>

        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Rating scale</h2>
            <p className="text-neutral-700 md:text-right md:max-w-sm">
              Ratings describe how frequently AI was used, its role, and what
              type of content it touched.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setRatingPage((page) => Math.max(0, page - 1))}
              disabled={ratingPage === 0}
              aria-label="Previous rating"
              className="flex-none px-3 h-10 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg shadow-sm hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setRatingPage((page) =>
                  Math.min(Math.ceil(allRatings.length / 3) - 1, page + 1)
                )
              }
              disabled={ratingPage === Math.ceil(allRatings.length / 3) - 1}
              aria-label="Next rating"
              className="order-3 flex-none px-3 h-10 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg shadow-sm hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>

            <div
              key={ratingPage}
              className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2 px-1 rating-page-in"
            >
              {allRatings.slice(ratingPage * 3, ratingPage * 3 + 3).map((code) => (
                <div
                  key={code}
                  className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Image
                    src={`/ratings/${code.toLowerCase()}.png`}
                    alt={`${code} rating badge`}
                    width={192}
                    height={192}
                    className="w-full rounded mb-3"
                  />
                  <div className="text-2xl font-bold font-mono text-neutral-900">
                    {code}
                  </div>
                  <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                    {getRatingSentence(code)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-2">How it works</h2>
          <p className="text-neutral-700 mb-6">
            Each rating consists of 3 letters:
          </p>
          <div className="space-y-4">
            <RatingTable
              title="Frequency"
              rows={[
                {
                  code: "O",
                  name: "Occasional",
                  meaning: "AI was used from time to time.",
                },
                {
                  code: "F",
                  name: "Frequent",
                  meaning: "AI was used regularly throughout the workflow.",
                },
              ]}
            />
            <RatingTable
              title="Role"
              rows={[
                {
                  code: "G",
                  name: "Generation",
                  meaning: "AI was used to create new content or material.",
                },
                {
                  code: "A",
                  name: "Assistance",
                  meaning:
                    "AI was used to assist the creator, without directly generating the final material.",
                },
                {
                  code: "B",
                  name: "Both",
                  meaning: "AI was used for both generation and assistance.",
                },
              ]}
            />
            <RatingTable
              title="Type"
              rows={[
                {
                  code: "T",
                  name: "Text",
                  meaning: "AI was used for written or textual content.",
                },
                {
                  code: "M",
                  name: "Media",
                  meaning:
                    "AI was used for images, video, audio, graphics, or other media.",
                },
                {
                  code: "C",
                  name: "Code",
                  meaning:
                    "AI was used for source code, scripts, markup, configuration, etc.",
                },
                {
                  code: "A",
                  name: "All",
                  meaning: "AI was used across text, media, and code.",
                },
              ]}
            />
          </div>
          <p className="text-neutral-700 mt-6">
            If no AI was used at all, the rating is{" "}
            <span className="font-mono">AAA</span>.
          </p>
        </section>

        <section ref={quizRef}>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Find your rating</h2>
          <div className="bg-white border border-neutral-300 rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="space-y-6">
              {visibleQuestions.map((q) => (
                <fieldset
                  key={q.id}
                  className="border-t border-neutral-200 pt-6"
                >
                  <legend className="text-base font-medium text-neutral-900 mb-3">
                    {q.text}
                  </legend>
                  <div className="space-y-2">
                    {q.options.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 cursor-pointer rounded-lg border px-4 py-3 transition-colors ${answers[q.id] === option.value
                          ? "border-neutral-900 bg-neutral-100"
                          : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={option.value}
                          checked={answers[q.id] === option.value}
                          onChange={() => handleChange(q.id, option.value)}
                          className="mt-1 accent-neutral-900"
                        />
                        <span className="text-neutral-700">
                          <span className="block font-medium text-neutral-900">
                            {option.label}
                          </span>
                          <span className="block text-sm leading-relaxed mt-0.5">
                            {option.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            {rating && (
              <div className="mt-8 bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
                  Your rating
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div>
                    <div className="text-4xl font-bold font-mono text-neutral-900">
                      {rating}
                    </div>
                    <div className="text-neutral-700 mt-1 text-lg">
                      {getRatingSentence(rating)}
                    </div>
                  </div>
                  <div className="flex-1" />
                  <Image
                    src={`/ratings/${rating.toLowerCase()}.png`}
                    alt={`${rating} rating badge`}
                    width={160}
                    height={160}
                    className="rounded"
                  />
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href={`/ratings/${rating.toLowerCase()}.png`}
                    download={`${rating.toLowerCase()}.png`}
                    className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
                  >
                    Download rating
                  </a>
                  <button
                    onClick={reset}
                    className="text-sm text-neutral-600 underline hover:text-neutral-900"
                  >
                    Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
