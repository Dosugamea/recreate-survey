"use client";

import { useMemo } from "react";
import { SurveyTitle } from "@/components/survey/header/SurveyTitle";
import { SurveyDescription } from "@/components/survey/header/SurveyDescription";
import { SurveyNotes } from "@/components/survey/messages/SurveyNotes";
import type { SurveySchema } from "@/lib/schemas";
import { useSurveyPeriod } from "@/hooks/useSurveyPeriod";

interface SurveyPreviewProps {
  formData: SurveySchema;
}

export function SurveyPreview({ formData }: SurveyPreviewProps) {
  // SurveySchemaをSurvey型に変換
  const previewSurvey = {
    id: "preview",
    appId: formData.appId || "",
    title: formData.title || "タイトル未設定",
    slug: formData.slug || "",
    description: formData.description || "",
    notes: formData.notes || "",
    startAt: formData.startAt,
    endAt: formData.endAt,
    themeColor: formData.themeColor || "#6c4034",
    headerImage: formData.headerImage || null,
    bgImage: formData.bgImage || null,
    isActive: formData.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
    webhookUrl: formData.webhookUrl || null,
  };

  const { themeColor, bgImage } = previewSurvey;
  const bgImageUrl = bgImage && bgImage.trim() !== "" ? bgImage : undefined;

  // startAtとendAtが必須なので、デフォルト値を設定
  const { startAt, endAt } = useMemo(() => {
    const now = new Date();
    return {
      startAt: previewSurvey.startAt || now,
      endAt:
        previewSurvey.endAt ||
        new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
    };
  }, [previewSurvey.startAt, previewSurvey.endAt]);

  const { periodMessage } = useSurveyPeriod({
    startAt,
    endAt,
  });

  return (
    <div className="sticky top-4">
      <div className="text-sm font-semibold mb-2 text-muted-foreground">
        プレビュー
      </div>
      <div
        className="font-sans bg-gray-50"
        style={{
          transform: "scale(0.75)",
          transformOrigin: "top left",
          width: "133.33%",
        }}
      >
        <div
          className="relative bg-repeat"
          style={{
            backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined,
          }}
        >
          <div
            className="relative max-w-md mx-auto shadow-2xl pb-10 sm:px-4"
            style={{
              color: themeColor,
              backgroundColor: "#ffffff",
              borderColor: themeColor,
            }}
          >
            <article>
              <SurveyTitle
                title={previewSurvey.title}
                headerImage={previewSurvey.headerImage}
              />
              <SurveyDescription
                description={previewSurvey.description}
                themeColor={previewSurvey.themeColor}
                periodMessage={periodMessage}
              />
            </article>
            <SurveyNotes survey={previewSurvey} />
          </div>
        </div>
      </div>
    </div>
  );
}
