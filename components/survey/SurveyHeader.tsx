import { Survey } from "@prisma/client";
import { hexToRgba } from "@/lib/utils";
import { format } from "date-fns";

interface SurveyHeaderProps {
  survey: Survey;
}

export function SurveyHeader({ survey }: SurveyHeaderProps) {
  const { title, description, startAt, endAt, themeColor, headerImage } =
    survey;
  const accentBg = hexToRgba(themeColor, 0.5);
  const lightAccentBg = hexToRgba(themeColor, 0.2);

  return (
    <article className="pt-4">
      <div id="ttl" className="text-center pb-4 px-4">
        {headerImage && (
          <img
            src={headerImage}
            alt="Header"
            className="mx-auto max-w-full h-auto mb-4"
          />
        )}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <section id="information" className="mb-8">
        <h3
          className="flex flex-col sm:flex-row text-white text-sm sm:text-base font-bold"
          style={{ backgroundColor: accentBg }}
        >
          <span className="flex-1 py-1 px-2">キャンペーン概要</span>
          {startAt && endAt && (
            <span
              className="flex-1 sm:text-right py-1 px-2"
              style={{ backgroundColor: lightAccentBg }}
            >
              期間: {format(startAt, "yyyy/MM/dd HH:mm")} -{" "}
              {format(endAt, "yyyy/MM/dd HH:mm")}
            </span>
          )}
        </h3>
        {description && (
          <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {description}
          </div>
        )}
      </section>
    </article>
  );
}
