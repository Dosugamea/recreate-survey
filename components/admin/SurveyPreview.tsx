"use client";

import { SurveyHeader } from "@/components/survey/SurveyHeader";
import type { SurveySchema } from "@/lib/schemas";

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
    startAt: formData.startAt || null,
    endAt: formData.endAt || null,
    themeColor: formData.themeColor || "#6c4034",
    headerImage: formData.headerImage || null,
    bgImage: formData.bgImage || null,
    isActive: formData.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const { themeColor, bgImage } = previewSurvey;
  const bgImageUrl = bgImage && bgImage.trim() !== "" ? bgImage : undefined;

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
            <SurveyHeader survey={previewSurvey} />
          </div>
        </div>
      </div>
    </div>
  );
}
