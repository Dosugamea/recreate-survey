import { Survey } from "@prisma/client";
import { hexToRgba } from "@/lib/utils";

interface SurveyNotesProps {
  survey: Survey;
}

export function SurveyNotes({ survey }: SurveyNotesProps) {
  const { notes, themeColor } = survey;
  const accentBg = hexToRgba(themeColor, 0.5);

  if (!notes) {
    return null;
  }

  return (
    <section id="notes">
      <h3
        className="flex flex-col sm:flex-row text-white text-sm sm:text-base font-bold"
        style={{ backgroundColor: accentBg }}
      >
        <span className="flex-1 py-5 px-6 text-2xl">注意事項</span>
      </h3>
      <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap">
        {notes}
      </div>
    </section>
  );
}
