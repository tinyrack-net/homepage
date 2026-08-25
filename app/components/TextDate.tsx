import type { SupportedLanguageCodes } from "@/lib/language.ts";

const PUBLISHED_DATE_TIME_ZONE = "Asia/Seoul";

export type TextDateProps = {
  lang: SupportedLanguageCodes;
  date: string;
  className?: string;
};

export function TextDate({ lang, date, className }: TextDateProps) {
  return (
    <time
      className={`text-tinyrack-sm text-tinyrack-text-muted${className ? ` ${className}` : ""}`}
      dateTime={date}
    >
      {new Date(date).toLocaleDateString(lang, {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: PUBLISHED_DATE_TIME_ZONE,
      })}
    </time>
  );
}
