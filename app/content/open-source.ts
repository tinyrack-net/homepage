import type { SupportedLanguageCodes } from "../lib/language.ts";

export type OpenSourceProjectId =
  | "dotweave"
  | "proxer"
  | "tinyauth"
  | "design"
  | "dart-packages";

export type OpenSourceProject = {
  id: OpenSourceProjectId;
  name: string;
  repository: string;
  homepage: string;
  language: string;
  stars: number;
  descriptions: Record<SupportedLanguageCodes, string>;
};

export type OpenSourceCopy = {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
  };
  projectsTitle: string;
  repositoryLabel: string;
  starsLabel: string;
};

export const OPEN_SOURCE_PROJECTS: readonly OpenSourceProject[] = [
  {
    id: "dotweave",
    name: "Dotweave",
    repository: "https://github.com/tinyrack-net/dotweave",
    homepage: "https://dotweave.tinyrack.net",
    language: "Dart",
    stars: 5,
    descriptions: {
      en: "A cross-platform CLI that syncs dotfiles with git and age encryption.",
      ko: "git과 age 암호화로 여러 기기의 dotfiles를 동기화하는 크로스 플랫폼 CLI예요.",
      ja: "gitとage暗号化でdotfilesを同期するクロスプラットフォームCLIです。",
    },
  },
  {
    id: "proxer",
    name: "Proxer",
    repository: "https://github.com/tinyrack-net/proxer",
    homepage: "https://proxer.tinyrack.net",
    language: "TypeScript",
    stars: 0,
    descriptions: {
      en: "A reverse-tunnel CLI for HTTP, SSE, and WebSocket services.",
      ko: "HTTP, SSE, WebSocket 서비스를 외부로 연결하는 리버스 터널 CLI예요.",
      ja: "HTTP、SSE、WebSocketサービスを公開するリバーストンネルCLIです。",
    },
  },
  {
    id: "tinyauth",
    name: "Tinyauth",
    repository: "https://github.com/tinyrack-net/tinyauth",
    homepage: "https://tinyauth.tinyrack.net",
    language: "TypeScript",
    stars: 0,
    descriptions: {
      en: "A lightweight, self-hosted OpenID Connect provider.",
      ko: "직접 운영할 수 있는 가벼운 OpenID Connect 공급자예요.",
      ja: "セルフホストできる軽量なOpenID Connectプロバイダーです。",
    },
  },
  {
    id: "design",
    name: "Tinyrack Design",
    repository: "https://github.com/tinyrack-net/design",
    homepage: "https://design.tinyrack.net",
    language: "TypeScript",
    stars: 0,
    descriptions: {
      en: "The shared design system for consistent Tinyrack interfaces.",
      ko: "Tinyrack 인터페이스를 일관되게 만드는 공용 디자인 시스템이에요.",
      ja: "Tinyrackのインターフェースを統一する共通デザインシステムです。",
    },
  },
  {
    id: "dart-packages",
    name: "Dart Packages",
    repository: "https://github.com/tinyrack-net/dart-packages",
    homepage: "https://github.com/tinyrack-net/dart-packages",
    language: "Dart",
    stars: 0,
    descriptions: {
      en: "Reusable Dart libraries maintained across Tinyrack projects.",
      ko: "Tinyrack 프로젝트 전반에서 함께 관리하는 재사용 가능한 Dart 라이브러리예요.",
      ja: "Tinyrackの各プロジェクトで共有する再利用可能なDartライブラリです。",
    },
  },
] as const;

export const openSourceCopy: Record<SupportedLanguageCodes, OpenSourceCopy> = {
  en: {
    meta: {
      title: "Open Source - Tinyrack",
      description:
        "Open-source tools we build, run in production, and develop in the open.",
    },
    hero: {
      eyebrow: "Open source",
      title: "Everything we build is open.",
      description:
        "We develop our tools in the open, run them in production, and stand behind them.",
      ctaLabel: "View on GitHub",
    },
    projectsTitle: "Projects",
    repositoryLabel: "Repository",
    starsLabel: "GitHub stars",
  },
  ko: {
    meta: {
      title: "오픈소스 - 타이니랙",
      description:
        "Tinyrack이 직접 만들고 운영하는 오픈소스 프로젝트들을 소개해요.",
    },
    hero: {
      eyebrow: "오픈소스",
      title: "만드는 것은 전부 공개해요.",
      description:
        "모든 도구를 공개적으로 개발하고, 직접 운영하면서 꾸준히 다듬어 가요.",
      ctaLabel: "GitHub에서 보기",
    },
    projectsTitle: "프로젝트",
    repositoryLabel: "저장소",
    starsLabel: "GitHub 스타",
  },
  ja: {
    meta: {
      title: "オープンソース - Tinyrack",
      description:
        "Tinyrackが自らつくり、運用しているオープンソースプロジェクトを紹介します。",
    },
    hero: {
      eyebrow: "オープンソース",
      title: "つくるものは、すべてオープンに。",
      description:
        "すべてのツールをオープンに開発し、自分たちで運用しながら育てています。",
      ctaLabel: "GitHubで見る",
    },
    projectsTitle: "プロジェクト",
    repositoryLabel: "リポジトリ",
    starsLabel: "GitHubスター",
  },
};
