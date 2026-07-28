import type { SupportedLanguageCodes } from "@/lib/language.ts";

/**
 * Landing page copy.
 *
 * The landing speaks in the company's voice ("we") and leads with philosophy,
 * not a catalogue: open infrastructure, developed in the open, self-hosted
 * first. Products and projects are never enumerated here — one band points at
 * `/open-source/`, which owns the lineup. Licensing remains a per-product
 * matter.
 */

export type LandingHeadlineSegment = {
  text: string;
  tone?: "inverse" | "muted";
};

export type LandingValueItem = {
  title: string;
  description: string;
};

export type LandingCopy = {
  hero: {
    /** Rendered as slash-separated fragments. */
    eyebrow: readonly string[];
    /** One entry per authored line, with optional semantic emphasis. */
    headline: readonly (readonly LandingHeadlineSegment[])[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    subhead: string;
  };
  values: {
    title: string;
    items: readonly LandingValueItem[];
  };
  work: {
    title: string;
    description: string;
    ctaLabel: string;
    githubCtaLabel: string;
  };
  blog: {
    title: string;
    description: string;
    linkLabel: string;
    empty: string;
  };
};

export const landingCopy: Record<SupportedLanguageCodes, LandingCopy> = {
  en: {
    hero: {
      eyebrow: ["Open infrastructure", "Self-hosted"],
      headline: [
        [{ text: "We build", tone: "inverse" }],
        [{ text: "open infrastructure.", tone: "muted" }],
      ],
      subhead:
        "Tinyrack builds open-source tools for people who run their own systems — developed in the open, self-hosted first.",
      primaryCtaLabel: "Explore our open source",
      secondaryCtaLabel: "About Tinyrack",
    },
    values: {
      title: "What we stand for",
      items: [
        {
          title: "Open source",
          description:
            "Everything we build starts in a public repository. Code, roadmap, and decisions are open for anyone to read — and anyone to contribute to.",
        },
        {
          title: "Self-hosting",
          description:
            "Every tool is built to run on your own hardware, inside your own four walls. Your data belongs on a machine you can unplug.",
        },
        {
          title: "Simplicity",
          description:
            "We keep things small and simple — fewer moving parts, readable code, and tools you can understand end to end.",
        },
      ],
    },
    work: {
      title: "What we make",
      description:
        "Small, focused infrastructure tools you can run yourself. Every project is developed in the open on GitHub — code, roadmap, and all.",
      ctaLabel: "Explore the projects",
      githubCtaLabel: "View on GitHub",
    },
    blog: {
      title: "From the engineering blog",
      description: "Notes on what we build, run, and learn along the way.",
      linkLabel: "Read the blog",
      empty: "There are no posts yet.",
    },
  },

  ko: {
    hero: {
      eyebrow: ["오픈 인프라", "셀프호스팅"],
      headline: [
        [{ text: "열린 인프라를", tone: "inverse" }],
        [{ text: "만들어요.", tone: "muted" }],
      ],
      subhead:
        "Tinyrack은 서버를 직접 운영하는 사람들을 위한 오픈소스 도구를 만들어요. 모든 개발 과정은 공개되어 있고, 셀프호스팅을 가장 먼저 생각해요.",
      primaryCtaLabel: "오픈소스 살펴보기",
      secondaryCtaLabel: "Tinyrack 소개",
    },
    values: {
      title: "우리가 지키는 원칙",
      items: [
        {
          title: "오픈소스",
          description:
            "만드는 모든 것은 공개 저장소에서 시작해요. 코드도 로드맵도 의사결정도, 누구나 들여다보고 누구나 기여할 수 있어요.",
        },
        {
          title: "셀프호스팅",
          description:
            "모든 도구는 집에 있는 내 하드웨어에서 돌아가도록 만들어요. 데이터는 언제든 전원을 뽑을 수 있는 내 기계에 두는 게 맞다고 믿어요.",
        },
        {
          title: "단순함",
          description:
            "작고 단순하게 만들어요. 움직이는 부품은 줄이고 코드는 읽기 좋게, 처음부터 끝까지 이해할 수 있는 도구를 지향해요.",
        },
      ],
    },
    work: {
      title: "우리가 만드는 것",
      description:
        "작지만 제 몫을 하는 인프라 도구들을 만들고 있어요. 모든 프로젝트는 GitHub에서 공개적으로 개발해요.",
      ctaLabel: "프로젝트 살펴보기",
      githubCtaLabel: "GitHub에서 보기",
    },
    blog: {
      title: "엔지니어링 블로그",
      description: "만들고 운영하면서 배운 것들을 기록해요.",
      linkLabel: "블로그 보기",
      empty: "아직 작성된 글이 없어요.",
    },
  },

  ja: {
    hero: {
      eyebrow: ["オープンインフラ", "セルフホスティング"],
      headline: [
        [{ text: "開かれたインフラを", tone: "inverse" }],
        [{ text: "つくります。", tone: "muted" }],
      ],
      subhead:
        "Tinyrackは、サーバーを自分で運用する人のためのオープンソースツールをつくっています。開発はすべてオープンに、セルフホスティングを第一に考えます。",
      primaryCtaLabel: "オープンソースを見る",
      secondaryCtaLabel: "Tinyrackについて",
    },
    values: {
      title: "私たちの原則",
      items: [
        {
          title: "オープンソース",
          description:
            "つくるものはすべて公開リポジトリから始まります。コードもロードマップも意思決定も、誰でも見られて、誰でも貢献できます。",
        },
        {
          title: "セルフホスティング",
          description:
            "すべてのツールは、自宅の自分のハードウェアで動くようにつくっています。データは、いつでも自分の手でプラグを抜けるマシンに。",
        },
        {
          title: "シンプルさ",
          description:
            "小さくシンプルに。動く部品を減らし、コードは読みやすく。最初から最後まで理解できるツールを目指しています。",
        },
      ],
    },
    work: {
      title: "私たちがつくるもの",
      description:
        "小さくても頼れるインフラツールをつくっています。すべてのプロジェクトはGitHubで公開開発しています。",
      ctaLabel: "プロジェクトを見る",
      githubCtaLabel: "GitHubで見る",
    },
    blog: {
      title: "エンジニアリングブログ",
      description: "つくり、運用しながら学んだことを記録しています。",
      linkLabel: "ブログを読む",
      empty: "まだ記事がありません。",
    },
  },
};
