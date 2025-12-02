// types/enums.ts
export const SectionType = {
  Table_of_Contents: "Table_of_Contents",
  Executive_Summary: "Executive_Summary",
  Technical_Approach: "Technical_Approach",
  Design: "Design",
  Capabilities: "Capabilities",
  Focus_Document: "Focus_Document",
  Narrative: "Narrative",
} as const;

export const StatusType = {
  Pending: "Pending",
  In_Progress: "In_Progress",
  Completed: "Completed",
} as const;

export const ReviewerType = {
  Assim: "Assim",
  Bini: "Bini",
  Mami: "Mami",
} as const;

export type SectionType = (typeof SectionType)[keyof typeof SectionType];
export type StatusType = (typeof StatusType)[keyof typeof StatusType];
export type ReviewerType = (typeof ReviewerType)[keyof typeof ReviewerType];
