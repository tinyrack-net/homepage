import type { SupportedLanguageCodes } from "@/lib/language.ts";

/**
 * Landing page copy.
 *
 * The landing page states what this place believes and then gets out of the
 * way, so this module is deliberately tiny: a hero and the latest-articles
 * heading. There is no slot for a section description — a section that needs a
 * paragraph to justify itself belongs on /about/.
 *
 * Products are not named here. The landing should hold up when the product
 * lineup changes, and licensing is a per-product matter, not a brand value.
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
  latest: {
    empty: string;
    linkLabel: string;
    title: string;
  };
};

export const landingCopy: Record<SupportedLanguageCodes, LandingCopy> = {
  en: {
    hero: {
      eyebrow: ["Self-hosted", "Homelab"],
      headline: [
        [{ text: "Your data ", tone: "inverse" }, { text: "belongs on" }],
        [{ text: "a machine " }, { text: "you can unplug.", tone: "muted" }],
      ],
      subhead: "Hardware and software for running your own, written from one.",
      primaryCtaLabel: "Read the blog",
      secondaryCtaLabel: "About",
    },
    latest: {
      title: "Latest",
      linkLabel: "Read the blog",
      empty: "No posts yet.",
    },
  },

  ko: {
    hero: {
      eyebrow: ["셀프호스팅", "홈랩"],
      headline: [
        [{ text: "내 데이터는" }],
        [
          { text: "내가 ", tone: "inverse" },
          { text: "전원을 뽑을 수 있는", tone: "muted" },
        ],
        [{ text: "기계에." }],
      ],
      subhead:
        "직접 운영하기 위한 하드웨어와 소프트웨어를, 직접 운영하면서 써요.",
      primaryCtaLabel: "블로그 보기",
      secondaryCtaLabel: "소개",
    },
    latest: {
      title: "최신 글",
      linkLabel: "블로그 보기",
      empty: "아직 올라온 글이 없어요.",
    },
  },

  ja: {
    hero: {
      eyebrow: ["セルフホスト", "ホームラボ"],
      headline: [
        [{ text: "自分で" }, { text: "電源を抜ける", tone: "muted" }],
        [{ text: "マシンに、" }, { text: "自分のデータを。", tone: "inverse" }],
      ],
      subhead:
        "自分で動かすためのハードとソフトを、自分で動かしながら書いています。",
      primaryCtaLabel: "ブログを読む",
      secondaryCtaLabel: "概要",
    },
    latest: {
      title: "最新の記事",
      linkLabel: "ブログを読む",
      empty: "まだ記事がありません。",
    },
  },
};
