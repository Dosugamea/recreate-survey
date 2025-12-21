"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportSurveyResultsAsCSV } from "@/app/actions/surveys";
import { useState } from "react";

interface ExportCSVButtonProps {
  surveyId: string;
}

export function ExportCSVButton({ surveyId }: ExportCSVButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportSurveyResultsAsCSV(surveyId);

      if (result.error) {
        alert(`エクスポートに失敗しました: ${result.error}`);
        return;
      }

      if (result.csv) {
        // CSVファイルをダウンロード
        const blob = new Blob([result.csv], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `survey-results-${surveyId}-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("エクスポート中にエラーが発生しました。");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isExporting} variant="outline">
      <Download className="h-4 w-4" />
      {isExporting ? "エクスポート中..." : "CSVエクスポート"}
    </Button>
  );
}
