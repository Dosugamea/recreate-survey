"use client";

import { useState } from "react";
import { Survey, Question } from "@prisma/client";
import { SurveyHeader } from "./SurveyHeader";
import { SurveyIntroduction } from "./SurveryIntroduction";
import { SurveyForm } from "./SurveyForm";

interface SurveyContentProps {
  survey: Survey;
  questions: Question[];
  userId: string;
  appName: string;
}

export function SurveyContent({
  survey,
  questions,
  userId,
  appName,
}: SurveyContentProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <>
      <SurveyHeader
        survey={survey}
        userId={userId}
        isSubmitted={isSubmitted}
        appName={appName}
      />
      {!isSubmitted && (
        <>
          <SurveyIntroduction themeColor={survey.themeColor} />
          <SurveyForm
            surveyId={survey.id}
            questions={questions}
            userId={userId}
            themeColor={survey.themeColor}
            onSubmitted={() => setIsSubmitted(true)}
          />
        </>
      )}
    </>
  );
}
