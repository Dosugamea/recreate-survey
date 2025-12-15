import { Survey } from "@prisma/client";

interface SurveyContainerProps {
  survey: Survey;
  children: React.ReactNode;
}

export function SurveyContainer({ survey, children }: SurveyContainerProps) {
  const { themeColor, bgImage } = survey;

  // Background style logic
  // If bgImage is present, use it.

  return (
    <main className="min-h-screen font-sans bg-gray-50">
      <div
        id="app-bg"
        className="relative min-h-screen bg-repeat"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        }}
      >
        <div
          id="app-content"
          className="relative max-w-3xl mx-auto min-h-screen shadow-2xl pb-10 sm:px-4"
          style={{
            color: themeColor,
            backgroundColor: "#ffffff",
            borderColor: themeColor,
          }}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
