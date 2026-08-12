export type Frequency = "O" | "F";
export type Role = "G" | "A" | "B";
export type Type = "T" | "M" | "C" | "A";
export type RatingCode = "AAA" | `${Frequency}${Role}${Type}`;

export interface Question {
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

export const questions: Question[] = [
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

export const allRatings: RatingCode[] = [
  "AAA",
  ...(["O", "F"] as Frequency[]).flatMap((frequency) =>
    (["G", "A", "B"] as Role[]).flatMap((role) =>
      (["T", "M", "C", "A"] as Type[]).map(
        (type) => `${frequency}${role}${type}` as RatingCode
      )
    )
  ),
];

export function getRatingSentence(code: RatingCode): string {
  if (code === "AAA") return "No AI was used.";

  const frequency = frequencyLabels[code[0] as Frequency].toLowerCase();
  const role = code[1] as Role;
  const type = typeSentenceLabels[code[2] as Type];

  if (role === "G") return `Project uses ${frequency} generated ${type}.`;
  if (role === "A") return `Project uses ${frequency} assistance for ${type}.`;
  return `Project uses ${frequency} generation and assistance for ${type}.`;
}
