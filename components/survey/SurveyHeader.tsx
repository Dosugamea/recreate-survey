"use client";

import { Survey } from "@prisma/client";
import { hexToRgba } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface SurveyHeaderProps {
  survey: Survey;
  userId?: string;
  isSubmitted?: boolean;
  appName?: string;
}

export function SurveyHeader({
  survey,
  userId,
  isSubmitted,
  appName,
}: SurveyHeaderProps) {
  const { title, description, startAt, endAt, themeColor, headerImage } =
    survey;
  const accentBg = hexToRgba(themeColor, 0.5);
  const lightAccentBg = hexToRgba(themeColor, 0.2);

  // 現在時刻を取得して期間の状態を判定
  const now = new Date();
  const isNotStarted = startAt ? now < startAt : false;
  const isExpired = endAt ? now > endAt : false;

  // キャンペーン期間のメッセージを生成
  const getCampaignPeriodMessage = (): string | null => {
    if (!startAt || !endAt) return null;

    if (isNotStarted) {
      return `キャンペーンは ${format(
        startAt,
        "yyyy年MM月dd日 HH:mm"
      )} 開始です`;
    }

    if (isExpired) {
      return "キャンペーンは終了しました";
    }

    return `実施期間: ${format(endAt, "yyyy年MM月dd日 HH:mmまで")}`;
  };

  const periodMessage = getCampaignPeriodMessage();

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

      {!userId && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <p className="text-sm text-yellow-700">
            キャンペーンに参加するためにはアプリ内からアクセスいただく必要があります。
          </p>
        </div>
      )}

      {isSubmitted && (
        <section id="completion">
          <h3
            className="flex flex-col sm:flex-row text-white text-sm sm:text-base font-bold"
            style={{ backgroundColor: accentBg }}
          >
            <span className="flex-1 py-5 px-6 text-2xl">
              内容の送信が完了しました
            </span>
          </h3>
          <div className="text-sm leading-relaxed text-center p-4">
            ご参加ありがとうございました。
            <br />
            今後とも『{appName || "アプリ"}』をよろしくお願いいたします。
          </div>
        </section>
      )}

      <section id="information">
        <h3
          className="flex flex-col sm:flex-row text-white text-sm sm:text-base font-bold"
          style={{ backgroundColor: accentBg }}
        >
          <span className="flex-1 py-5 px-6 text-2xl">キャンペーン情報</span>
          {periodMessage && (
            <span
              className="flex-1 text-center text-sm rounded my-auto py-3 h-full mx-6"
              style={{ backgroundColor: lightAccentBg }}
            >
              {periodMessage}
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
