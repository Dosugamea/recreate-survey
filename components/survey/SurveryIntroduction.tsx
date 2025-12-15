import { hexToRgba } from "@/lib/utils";

export function SurveyIntroduction({ themeColor }: { themeColor: string }) {
  const accentBg = hexToRgba(themeColor, 0.5);

  return (
    <>
      <h3
        className="flex flex-col sm:flex-row text-white text-sm sm:text-base font-bold"
        style={{ backgroundColor: accentBg }}
      >
        <span className="flex-1 py-5 px-6 text-2xl">アンケート回答</span>
      </h3>
      <div id="read" className="text-sm text-center my-8 font-medium">
        以下の設問にお答えください。
      </div>
    </>
  );
}
