"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type Frequency = "O" | "F";
type Role = "G" | "A" | "B";
type Type = "T" | "M" | "C" | "A";
type RatingCode = "AAA" | `${Frequency}${Role}${Type}`;

interface Question {
  id: string;
  text: string;
  options: { value: string; label: string; description: string }[];
}

const frequencyLabels: Record<Frequency, string> = {
  O: "Occasional",
  F: "Frequent",
};

const typeSentenceLabels: Record<Type, string> = {
  T: "text",
  M: "media",
  C: "code",
  A: "text, media, and code",
};

const questions: Question[] = [
  {
    id: "used",
    text: "Did you use AI to help create this content?",
    options: [
      {
        value: "yes",
        label: "Yes",
        description: "AI was used somewhere in the creation process.",
      },
      {
        value: "no",
        label: "No",
        description: "The content was made without using AI.",
      },
    ],
  },
  {
    id: "frequency",
    text: "How often did you use AI in your workflow?",
    options: [
      {
        value: "O",
        label: "Occasional",
        description: "AI was used from time to time, not throughout the workflow.",
      },
      {
        value: "F",
        label: "Frequent",
        description: "AI was used regularly throughout the workflow.",
      },
    ],
  },
  {
    id: "role",
    text: "What role did AI play?",
    options: [
      {
        value: "G",
        label: "Generation",
        description: "AI created new content or material used in the final work.",
      },
      {
        value: "A",
        label: "Assistance",
        description: "AI helped the creator, but did not directly generate the final material.",
      },
      {
        value: "B",
        label: "Both",
        description: "AI both created material and assisted the creator.",
      },
    ],
  },
  {
    id: "type",
    text: "What type of content did AI work on?",
    options: [
      {
        value: "T",
        label: "Text",
        description: "Written or textual content.",
      },
      {
        value: "M",
        label: "Media",
        description: "Images, video, audio, graphics, or other media.",
      },
      {
        value: "C",
        label: "Code",
        description: "Source code, scripts, markup, or configuration.",
      },
      {
        value: "A",
        label: "All",
        description: "Text, media, and code were all involved.",
      },
    ],
  },
];

const allRatings: RatingCode[] = [
  "AAA",
  ...(
    ["O", "F"] as Frequency[]
  ).flatMap((freq) =>
    (["G", "A", "B"] as Role[]).flatMap((role) =>
      (["T", "M", "C", "A"] as Type[]).map(
        (type) => `${freq}${role}${type}` as RatingCode
      )
    )
  ),
];

function getRatingSentence(code: RatingCode): string {
  if (code === "AAA") return "No AI was used.";

  const freq = frequencyLabels[code[0] as Frequency].toLowerCase();
  const role = code[1] as Role;
  const type = typeSentenceLabels[code[2] as Type];

  if (role === "G") return `Project uses ${freq} generated ${type}.`;
  if (role === "A") return `Project uses ${freq} assistance for ${type}.`;
  return `Project uses ${freq} generation and assistance for ${type}.`;
}

function Table({
  title,
  rows,
}: {
  title: string;
  rows: { code: string; name: string; meaning: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <h3 className="px-4 pt-4 text-lg font-semibold text-neutral-900">
        {title}
      </h3>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-neutral-500">
            <th className="px-4 py-2 font-medium w-16">Code</th>
            <th className="px-4 py-2 font-medium w-32">Name</th>
            <th className="px-4 py-2 font-medium">Meaning</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rows.map((row) => (
            <tr key={row.code} className="border-t border-neutral-200">
              <td className="px-4 py-2 font-mono font-medium text-neutral-900">
                {row.code}
              </td>
              <td className="px-4 py-2 text-neutral-700">{row.name}</td>
              <td className="px-4 py-2 text-neutral-700">{row.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
            <Table
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
            <Table
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
            <Table
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
