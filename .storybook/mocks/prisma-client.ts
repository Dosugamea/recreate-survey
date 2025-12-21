// Mock @prisma/client for Storybook browser environment
// This prevents .prisma/client/index-browser from being loaded in the browser

// Export types that are commonly used in components
export type Survey = {
  id: string;
  appId: string;
  slug: string;
  title: string;
  description: string | null;
  themeColor: string;
  notes: string | null;
  headerImage: string | null;
  bgImage: string | null;
  contactUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  startAt: Date | null;
  endAt: Date | null;
};

export type Question = {
  id: string;
  surveyId: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  maxLength: number | null;
  options: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type App = {
  id: string;
  name: string;
  slug: string;
  privacyPolicyUrl: string | null;
  faviconImageUrl: string | null;
  copyrightNotice: string | null;
  contactUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Export a mock PrismaClient class for type compatibility
export class PrismaClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
