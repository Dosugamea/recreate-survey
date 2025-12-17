import { Question } from "@prisma/client";
import { UseFormRegister, FieldValues } from "react-hook-form";
import { cn, hexToRgba } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface QuestionItemProps {
  question: Question;
  register: UseFormRegister<FieldValues>;
  themeColor: string;
  error?: string;
}

export function QuestionItem({
  question,
  register,
  themeColor,
  error,
}: QuestionItemProps) {
  const options = question.options ? JSON.parse(question.options) : [];

  // Dynamic styles
  const legendStyle = {
    backgroundColor: hexToRgba(themeColor, 0.1),
    borderColor: themeColor,
    color: themeColor,
    borderWidth: "1px",
    borderStyle: "solid",
  };

  return (
    <fieldset className="mb-6">
      <legend
        className="w-full p-2 mb-2 font-bold text-sm sm:text-base rounded"
        style={legendStyle}
      >
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </legend>
      <div className="px-2">
        {question.type === "TEXT" && (
          <Input
            {...register(question.id, { required: question.required })}
            placeholder="回答を入力してください"
            className={cn(error && "border-red-500")}
          />
        )}
        {question.type === "EMAIL" && (
          <Input
            type="email"
            {...register(question.id, { required: question.required })}
            placeholder="email@example.com"
            className={cn(error && "border-red-500")}
          />
        )}
        {question.type === "RADIO" && (
          <div className="space-y-2">
            {options.map((opt: string) => (
              <div key={opt} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${question.id}-${opt}`}
                  value={opt}
                  {...register(question.id, { required: question.required })}
                  className="accent-current"
                  style={{ accentColor: themeColor }}
                />
                <Label htmlFor={`${question.id}-${opt}`}>{opt}</Label>
              </div>
            ))}
          </div>
        )}
        {question.type === "CHECKBOX" && (
          <div className="space-y-2">
            {options.map((opt: string) => (
              <div key={opt} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${question.id}-${opt}`}
                  value={opt}
                  {...register(question.id, { required: question.required })}
                  className="accent-current"
                  style={{ accentColor: themeColor }}
                />
                <Label htmlFor={`${question.id}-${opt}`}>{opt}</Label>
              </div>
            ))}
          </div>
        )}
        {question.type === "SELECT" && (
          <select
            {...register(question.id, { required: question.required })}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              "bg-white text-gray-900 border-gray-300 focus:ring-offset-white",
              error && "border-red-500"
            )}
            style={{
              borderColor: error ? undefined : themeColor,
              "--tw-ring-color": themeColor,
            } as React.CSSProperties & { "--tw-ring-color": string }}
          >
            <option value="">選択してください</option>
            {options.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {error && (
          <p className="text-red-500 text-xs mt-1">この項目は必須です</p>
        )}
      </div>
    </fieldset>
  );
}
