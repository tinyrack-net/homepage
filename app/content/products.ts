import type { SupportedLanguageCodes } from "@/lib/language.ts";

export type ProductsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
};

/** The products overview page is still being built, so it stands in with a
    clear "coming soon" state and points visitors to what already ships. */
export const productsCopy: Record<SupportedLanguageCodes, ProductsCopy> = {
  en: {
    eyebrow: "Products",
    title: "Coming soon.",
    description:
      "We're putting together one place to see everything Tinyrack builds. It's not ready yet — in the meantime, our open source is the best way to see what we're working on.",
    ctaLabel: "Explore our open source",
  },
  ko: {
    eyebrow: "제품",
    title: "준비 중이에요.",
    description:
      "Tinyrack이 만드는 것들을 한곳에서 볼 수 있는 페이지를 준비하고 있어요. 아직 완성되진 않았는데, 그동안은 오픈소스에서 저희가 무엇을 만들고 있는지 가장 잘 보실 수 있어요.",
    ctaLabel: "오픈소스 살펴보기",
  },
  ja: {
    eyebrow: "プロダクト",
    title: "準備中です。",
    description:
      "Tinyrackがつくるものをまとめて見られるページを準備しています。まだ完成していませんが、それまではオープンソースで私たちが取り組んでいるものを一番よくご覧いただけます。",
    ctaLabel: "オープンソースを見る",
  },
};
