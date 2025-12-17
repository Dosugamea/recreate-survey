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
        className="relative min-h-screen"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: bgImage ? "cover" : undefined,
          backgroundRepeat: bgImage ? "no-repeat" : undefined,
          backgroundPosition: bgImage ? "center" : undefined,
        }}
      >
        <div
          id="app-content"
          className="relative max-w-[640px] mx-auto min-h-screen shadow-xl pb-10"
          style={
            {
              color: themeColor,
              backgroundColor: "#ffffff",
              borderColor: themeColor,
              // フォーム専用のCSS変数を定義してグローバルテーマの影響を遮断
              "--form-primary": themeColor,
              "--form-primary-foreground": "#ffffff",
              "--form-background": "#ffffff",
              "--form-foreground": "#000000",
              "--form-border": themeColor,
              "--form-input": "#e5e7eb",
              "--form-ring": themeColor,
              "--form-muted": "#f3f4f6",
              "--form-muted-foreground": "#6b7280",
              "--form-accent": themeColor,
              "--form-accent-foreground": "#ffffff",
            } as React.CSSProperties & {
              "--form-primary": string;
              "--form-primary-foreground": string;
              "--form-background": string;
              "--form-foreground": string;
              "--form-border": string;
              "--form-input": string;
              "--form-ring": string;
              "--form-muted": string;
              "--form-muted-foreground": string;
              "--form-accent": string;
              "--form-accent-foreground": string;
            }
          }
        >
          {children}
        </div>
      </div>
    </main>
  );
}
