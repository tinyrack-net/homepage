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

export type LandingCopy = {
  hero: {
    /** Rendered as slash-separated fragments. */
    eyebrow: readonly string[];
    /** One entry per rendered line. */
    headline: readonly string[];
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
      headline: ["Your data belongs on", "a machine you can unplug."],
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
      headline: ["내 데이터는 내가 전원을", "뽑을 수 있는 기계에."],
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
      headline: ["自分で電源を抜ける", "マシンに、自分のデータを。"],
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
