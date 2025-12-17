import { Survey } from "@prisma/client";
import { hexToRgba } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface SurveyHeaderProps {
  survey: Survey;
}

export function SurveyHeader({ survey }: SurveyHeaderProps) {
  const { title, description, startAt, endAt, themeColor, headerImage } =
    survey;
  const accentBg = hexToRgba(themeColor, 0.5);
  const lightAccentBg = hexToRgba(themeColor, 0.2);

  return (
    <article>
      <div id="ttl" className="text-center">
        {headerImage && (
          <Image
            src={headerImage}
            alt="Header"
            width={1200}
            height={600}
            className="mx-auto w-full h-auto"
            sizes="100vw"
            loading="eager"
          />
        )}
        {!headerImage && <h2 className="text-2xl font-bold py-8">{title}</h2>}
      </div>

      <section id="information" className="mb-8">
        <h3
          className="flex flex-col sm:flex-row text-white text-sm sm:text-base font-bold"
          style={{ backgroundColor: accentBg }}
        >
          <span className="flex-1 py-5 px-6 text-2xl">キャンペーン情報</span>
          {startAt && endAt && (
            <span
              className="flex-1 text-center text-sm rounded my-auto py-3 h-full mx-6"
              style={{ backgroundColor: lightAccentBg }}
            >
              実施期間: {format(endAt, "yyyy年MM月dd日 HH:mmまで")}
            </span>
          )}
        </h3>
        {description && (
          <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap">
            {description}
          </div>
        )}
      </section>
    </article>
  );
}
