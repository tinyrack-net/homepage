import type { SupportedLanguageCodes } from "@/lib/language.ts";

/**
 * Landing page copy.
 *
 * The landing page introduces the workshop in the operator's own voice, then
 * gets visitors into the writing. Products are not named here: the copy should
 * stay useful as the lineup changes.
 *
 * Licensing remains a per-product matter, not a landing-page message.
 */

export type LandingHeadlineSegment = {
  text: string;
  tone?: "inverse" | "muted";
};

export type LandingCopy = {
  hero: {
    /** Rendered as slash-separated fragments. */
    eyebrow: readonly string[];
    /** One entry per authored line, with optional semantic emphasis. */
    headline: readonly (readonly LandingHeadlineSegment[])[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    /** Hidden below `md` — the headline has to carry the page on its own. */
    subhead: string;
  };
  featured: {
    label: string;
  };
  recent: {
    empty: string;
    linkLabel: string;
    title: string;
  };
};

export const landingCopy: Record<SupportedLanguageCodes, LandingCopy> = {
  en: {
    hero: {
      eyebrow: ["Notes from a homelab"],
      headline: [
        [
          { text: "I run ", tone: "inverse" },
          { text: "what I use.", tone: "muted" },
        ],
      ],
      subhead:
        "A homelab where I run servers, build tools, and write down what I learn.",
      primaryCtaLabel: "Read the latest",
      secondaryCtaLabel: "About Tinyrack",
    },
    featured: { label: "Latest note" },
    recent: {
      title: "More notes",
      linkLabel: "Read the blog",
      empty: "There are no notes yet.",
    },
  },

  ko: {
    hero: {
      eyebrow: ["홈랩에서 보낸 기록"],
      headline: [
        [
          { text: "필요한 건 ", tone: "inverse" },
          { text: "직접 돌려봐요.", tone: "muted" },
        ],
      ],
      subhead:
        "집에서 서버를 돌리고, 직접 만든 도구를 써보면서 알게 된 것들을 기록해요.",
      primaryCtaLabel: "최근 글 읽어보기",
      secondaryCtaLabel: "Tinyrack 소개",
    },
    featured: { label: "최근 기록" },
    recent: {
      title: "더 읽어보기",
      linkLabel: "블로그 보기",
      empty: "아직 기록한 글이 없어요.",
    },
  },

  ja: {
    hero: {
      eyebrow: ["ホームラボの記録"],
      headline: [
        [{ text: "使うものは、" }, { text: "自分で動かす。", tone: "muted" }],
      ],
      subhead:
        "家でサーバーを動かし、つくった道具を使いながら、わかったことを書いています。",
      primaryCtaLabel: "最新の記事を読む",
      secondaryCtaLabel: "Tinyrackについて",
    },
    featured: { label: "最近の記録" },
    recent: {
      title: "もっと読む",
      linkLabel: "ブログを読む",
      empty: "まだ記録がありません。",
    },
  },
};
