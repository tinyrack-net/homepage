import type { SupportedLanguageCodes } from "@/lib/language.ts";

/**
 * Landing page copy, kept out of the flat i18n key files because these are
 * paragraphs and lists rather than short UI labels.
 *
 * Every product claim here must be checkable against the project's own README
 * or docs. Do not add capabilities, adoption numbers, or benchmarks that the
 * implementation does not back.
 */

export type LandingLink = {
  href: string;
  label: string;
};

export type LandingProduct = {
  description: string;
  docsHref?: string;
  install?: string;
  license: string;
  name: string;
  points: readonly string[];
  repoHref: string;
  siteHref?: string;
  tagline: string;
};

export type LandingValue = {
  body: string;
  title: string;
};

export type LandingStep = {
  body: string;
  title: string;
};

export type LandingCopy = {
  community: {
    intro: string;
    links: readonly (LandingLink & { description: string })[];
    title: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    primaryCta: LandingLink;
    /** Routes to the blog, so only the label varies by locale. */
    secondaryCtaLabel: string;
    subhead: string;
  };
  latest: {
    empty: string;
    linkLabel: string;
    title: string;
  };
  products: {
    intro: string;
    items: readonly LandingProduct[];
    title: string;
  };
  start: {
    intro: string;
    steps: readonly LandingStep[];
    title: string;
  };
  values: {
    intro: string;
    items: readonly LandingValue[];
    title: string;
  };
};

const GITHUB = "https://github.com/tinyrack-net";
const FORUM = "https://forum.tinyrack.net/";
const YOUTUBE = "https://www.youtube.com/@tinyrack";

export const landingCopy: Record<SupportedLanguageCodes, LandingCopy> = {
  en: {
    hero: {
      eyebrow: "Self-hosting, in the open",
      headline: "Your data belongs on a machine you can unplug.",
      subhead:
        "Tinyrack is a homelab workshop. It reviews the hardware, documents the builds, and ships MIT-licensed tools for running your own services — the same tools that keep this site online.",
      primaryCta: { href: GITHUB, label: "Browse the source" },
      secondaryCtaLabel: "Read the blog",
    },
    values: {
      title: "Why self-host",
      intro:
        "Self-hosting trades a monthly invoice for a machine you control. That trade is worth making for some things and not others, so here is what it actually buys.",
      items: [
        {
          title: "Your data stays where you put it",
          body: "Files, photos, and notes live on a disk in your home or your own server. Nothing moves to a provider you have to trust, and nothing disappears when a product shuts down.",
        },
        {
          title: "The bill stops growing",
          body: "An old desktop or a used mini PC can host a surprising number of services. The hardware is a one-time cost, and it can keep working equipment out of the waste stream.",
        },
        {
          title: "You learn the whole stack",
          body: "Running the service teaches you the network, the storage, and the failure modes underneath it. That knowledge transfers to every other system you touch.",
        },
        {
          title: "Open source keeps you free to leave",
          body: "Every tool published here is MIT licensed with the source in the open. Read it, fork it, or run a patched build — there is no lock-in to negotiate.",
        },
      ],
    },
    products: {
      title: "Open-source tools",
      intro:
        "Built for problems that came up while running this homelab, then released for anyone with the same problem.",
      items: [
        {
          name: "Dotweave",
          tagline:
            "Git-backed configuration sync for your development environment.",
          description:
            "A cross-platform CLI that syncs the config files in your home directory across machines using git. Most dotfiles tools start from the repository and ask you to reshape your system around it. Dotweave inverts that: the real config under HOME is the source of truth, and the repository is just the sync artifact.",
          points: [
            "Track files and directories under your home directory",
            "Encrypt secrets with age before they reach the repository",
            "Profiles for syncing different subsets on different machines",
            "Platform-specific paths across Windows, macOS, Linux, and WSL",
            "Dry-run previews for both push and pull",
          ],
          install: "brew install tinyrack-net/tap/dotweave",
          license: "MIT",
          repoHref: `${GITHUB}/dotweave`,
          siteHref: "https://dotweave.tinyrack.net",
          docsHref: "https://dotweave.tinyrack.net/en/getting-started/",
        },
        {
          name: "Proxer",
          tagline:
            "A small reverse-tunnel CLI for putting a private HTTP service behind a public URL you control.",
          description:
            "For the familiar case where a service runs on a laptop, mini PC, NAS, or office box and needs a stable public URL without opening inbound ports. You run one public Proxer server, and each private machine dials out to it over a WebSocket tunnel. The tunnel server lives in your own VPS or homelab edge, not someone else's platform.",
          points: [
            "No inbound ports opened into the private network",
            "HTTP, Server-Sent Events, and WebSocket upgrades pass through",
            "Explicit host routing, so unknown hosts return 404 instead of guessing",
            "The tunnel server runs on infrastructure you own",
          ],
          install: "npm install -g @tinyrack/proxer",
          license: "MIT",
          repoHref: `${GITHUB}/proxer`,
          siteHref: "https://proxer.tinyrack.net",
        },
      ],
    },
    start: {
      title: "Starting a homelab",
      intro:
        "You do not need a rack or a server-grade budget. An old desktop and an evening are enough to get the first service running.",
      steps: [
        {
          title: "Find the hardware",
          body: "A retired desktop, a laptop with a broken screen, or a used mini PC all work. Reviews here cover small machines and the trade-offs between them.",
        },
        {
          title: "Pick an operating system",
          body: "Any Linux distribution you are willing to read the docs for will do. Start with one service so that a mistake only costs you that service.",
        },
        {
          title: "Run something you actually want",
          body: "Photo backup, ad blocking, a password manager, notes, or a game server. Choosing a service you will use every day is what keeps the machine maintained.",
        },
        {
          title: "Ask when you get stuck",
          body: "The forum has a wiki and people working through the same problems. Getting unstuck quickly is the difference between a hobby and an abandoned box.",
        },
      ],
    },
    community: {
      title: "Where the work happens",
      intro:
        "Reviews and build notes get written here. Everything else happens in the open.",
      links: [
        {
          label: "Forum",
          href: FORUM,
          description:
            "A wiki and a place to ask questions while you are setting something up.",
        },
        {
          label: "GitHub",
          href: GITHUB,
          description:
            "Source for every tool published here, plus this site itself.",
        },
        {
          label: "YouTube",
          href: YOUTUBE,
          description: "Hardware walkthroughs and build videos.",
        },
      ],
    },
    latest: {
      title: "Latest",
      linkLabel: "Read the blog",
      empty: "No posts yet.",
    },
  },

  ko: {
    hero: {
      eyebrow: "직접 운영하는 즐거움",
      headline: "내 데이터는 내가 전원을 뽑을 수 있는 기계에 있어야죠.",
      subhead:
        "타이니랙은 홈랩 작업실이에요. 하드웨어를 살펴보고, 구축 과정을 기록하고, 직접 서비스를 운영하기 위한 MIT 라이선스 도구를 공개해요. 이 사이트도 그 도구로 돌아가요.",
      primaryCta: { href: GITHUB, label: "소스 보기" },
      secondaryCtaLabel: "블로그 보기",
    },
    values: {
      title: "왜 직접 호스팅할까요",
      intro:
        "셀프호스팅은 매달 나가는 청구서를 내가 통제하는 기계 한 대와 맞바꾸는 일이에요. 모든 경우에 유리하지는 않으니, 실제로 무엇을 얻는지 짚어 볼게요.",
      items: [
        {
          title: "데이터가 둔 자리에 그대로 있어요",
          body: "파일과 사진, 메모가 집에 있는 디스크나 직접 운영하는 서버에 남아요. 믿어야만 하는 사업자에게 옮겨 갈 일도, 서비스 종료와 함께 사라질 일도 없어요.",
        },
        {
          title: "비용이 더 늘지 않아요",
          body: "오래된 데스크톱이나 중고 미니 PC 한 대로도 생각보다 많은 서비스를 돌릴 수 있어요. 하드웨어 값은 한 번만 들고, 아직 쓸 만한 장비를 폐기물로 보내지 않아도 돼요.",
        },
        {
          title: "스택 전체를 익히게 돼요",
          body: "서비스를 직접 운영하면 그 아래의 네트워크와 스토리지, 그리고 고장 나는 방식까지 알게 돼요. 이 감각은 다른 시스템을 다룰 때도 그대로 쓰여요.",
        },
        {
          title: "오픈소스라 언제든 떠날 수 있어요",
          body: "여기서 공개하는 도구는 모두 MIT 라이선스이고 소스가 열려 있어요. 읽어 보고, 포크하고, 고쳐서 빌드해도 돼요. 협상해야 할 종속이 없어요.",
        },
      ],
    },
    products: {
      title: "오픈소스 도구",
      intro:
        "홈랩을 운영하다 마주친 문제를 풀려고 만들었고, 같은 문제를 겪는 사람을 위해 공개했어요.",
      items: [
        {
          name: "Dotweave",
          tagline: "git으로 개발 환경 설정을 동기화하는 도구예요.",
          description:
            "홈 디렉터리의 설정 파일을 git으로 여러 기기에 동기화하는 크로스 플랫폼 CLI예요. 대부분의 dotfiles 도구는 저장소를 기준으로 삼고 시스템을 거기에 맞추라고 요구해요. Dotweave는 반대로 HOME에 있는 실제 설정을 원본으로 두고, 저장소는 동기화를 위한 산출물로만 다뤄요.",
          points: [
            "홈 디렉터리 아래의 파일과 디렉터리를 추적해요",
            "비밀 값은 age로 암호화한 뒤에 저장소에 올려요",
            "프로파일로 기기마다 다른 범위를 동기화할 수 있어요",
            "Windows, macOS, Linux, WSL의 서로 다른 경로를 다뤄요",
            "push와 pull 양쪽 모두 미리 보기를 지원해요",
          ],
          install: "brew install tinyrack-net/tap/dotweave",
          license: "MIT",
          repoHref: `${GITHUB}/dotweave`,
          siteHref: "https://dotweave.tinyrack.net",
          docsHref: "https://dotweave.tinyrack.net/ko/",
        },
        {
          name: "Proxer",
          tagline:
            "내부 HTTP 서비스를 직접 관리하는 공개 주소로 노출하는 리버스 터널 CLI예요.",
          description:
            "노트북이나 미니 PC, NAS, 사무실 장비에서 돌아가는 서비스에 안정적인 공개 주소가 필요하지만 인바운드 포트는 열고 싶지 않을 때 쓰는 도구예요. 공개된 곳에 Proxer 서버를 하나 띄우고, 내부 장비가 WebSocket 터널로 바깥을 향해 연결해요. 터널 서버는 남의 플랫폼이 아니라 직접 관리하는 VPS나 홈랩 경계에 둬요.",
          points: [
            "내부 네트워크로 들어오는 포트를 열지 않아요",
            "HTTP와 Server-Sent Events, WebSocket 업그레이드가 그대로 통과해요",
            "호스트 라우팅이 명시적이라, 등록되지 않은 호스트는 추측하지 않고 404를 돌려줘요",
            "터널 서버를 직접 소유한 인프라에서 운영해요",
          ],
          install: "npm install -g @tinyrack/proxer",
          license: "MIT",
          repoHref: `${GITHUB}/proxer`,
          siteHref: "https://proxer.tinyrack.net",
        },
      ],
    },
    start: {
      title: "홈랩 시작하기",
      intro:
        "랙도, 서버급 예산도 필요하지 않아요. 오래된 데스크톱 한 대와 저녁 시간이면 첫 서비스를 띄울 수 있어요.",
      steps: [
        {
          title: "장비를 구해요",
          body: "쓰지 않는 데스크톱, 화면이 깨진 노트북, 중고 미니 PC 모두 괜찮아요. 작은 기계들과 그 장단점은 여기 리뷰에서 다뤄요.",
        },
        {
          title: "운영체제를 골라요",
          body: "문서를 읽어 볼 마음이 드는 리눅스 배포판이면 충분해요. 서비스 하나로 시작하면 실수해도 그 하나만 잃어요.",
        },
        {
          title: "정말 쓸 서비스를 올려요",
          body: "사진 백업, 광고 차단, 비밀번호 관리, 메모, 게임 서버 같은 것들이요. 매일 쓰는 서비스를 골라야 기계를 계속 돌보게 돼요.",
        },
        {
          title: "막히면 물어봐요",
          body: "포럼에 위키가 있고, 같은 문제를 겪는 사람들이 있어요. 빨리 풀리느냐가 취미로 남느냐 방치된 상자가 되느냐를 가르거든요.",
        },
      ],
    },
    community: {
      title: "작업이 이어지는 곳",
      intro:
        "리뷰와 구축 기록은 여기에 써요. 나머지는 모두 공개된 곳에서 이뤄져요.",
      links: [
        {
          label: "포럼",
          href: FORUM,
          description: "위키가 있고, 무언가 꾸리다 막혔을 때 물어볼 수 있어요.",
        },
        {
          label: "GitHub",
          href: GITHUB,
          description: "여기서 공개한 도구와 이 사이트의 소스가 있어요.",
        },
        {
          label: "YouTube",
          href: YOUTUBE,
          description: "하드웨어를 살펴보고 직접 꾸려 보는 영상이에요.",
        },
      ],
    },
    latest: {
      title: "최신 글",
      linkLabel: "블로그 보기",
      empty: "아직 올라온 글이 없어요.",
    },
  },

  ja: {
    hero: {
      eyebrow: "自分で動かすということ",
      headline: "自分で電源を抜けるマシンに、自分のデータを置く。",
      subhead:
        "Tinyrack はホームラボの作業場です。ハードウェアをレビューし、構築を記録し、自分でサービスを動かすための MIT ライセンスのツールを公開しています。このサイトも同じツールで動いています。",
      primaryCta: { href: GITHUB, label: "ソースを見る" },
      secondaryCtaLabel: "ブログを読む",
    },
    values: {
      title: "なぜ自分で動かすのか",
      intro:
        "セルフホスティングは、毎月の請求書を自分で管理する 1 台のマシンと引き換えにすることです。すべての場合に有利とは限らないので、実際に何が得られるのかを整理します。",
      items: [
        {
          title: "データは置いた場所に残ります",
          body: "ファイルや写真、メモが自宅のディスクや自分で運用するサーバーに残ります。信頼するしかない事業者へ移す必要もなく、サービス終了とともに消えることもありません。",
        },
        {
          title: "費用がそれ以上増えません",
          body: "古いデスクトップや中古のミニ PC 1 台でも、思ったより多くのサービスを動かせます。ハードウェアの費用は一度きりで、まだ使える機材を廃棄せずに済みます。",
        },
        {
          title: "スタック全体が身につきます",
          body: "サービスを自分で動かすと、その下にあるネットワークやストレージ、そして壊れ方まで分かってきます。この感覚は他のシステムを扱うときにもそのまま生きます。",
        },
        {
          title: "オープンソースなのでいつでも離れられます",
          body: "ここで公開しているツールはすべて MIT ライセンスで、ソースも公開しています。読んで、フォークして、修正してビルドできます。交渉が必要なロックインはありません。",
        },
      ],
    },
    products: {
      title: "オープンソースのツール",
      intro:
        "このホームラボを運用する中で出てきた課題のために作り、同じ課題を抱える人のために公開しています。",
      items: [
        {
          name: "Dotweave",
          tagline: "git で開発環境の設定を同期するツールです。",
          description:
            "ホームディレクトリの設定ファイルを git で複数のマシンに同期するクロスプラットフォームの CLI です。多くの dotfiles ツールはリポジトリを基準にして、システムをそれに合わせるよう求めます。Dotweave は逆で、HOME にある実際の設定を正とし、リポジトリは同期のための成果物として扱います。",
          points: [
            "ホームディレクトリ配下のファイルとディレクトリを追跡します",
            "秘密の値は age で暗号化してからリポジトリに保存します",
            "プロファイルでマシンごとに異なる範囲を同期できます",
            "Windows、macOS、Linux、WSL のパスの違いを扱います",
            "push と pull の両方でドライラン表示ができます",
          ],
          install: "brew install tinyrack-net/tap/dotweave",
          license: "MIT",
          repoHref: `${GITHUB}/dotweave`,
          siteHref: "https://dotweave.tinyrack.net",
        },
        {
          name: "Proxer",
          tagline:
            "プライベートな HTTP サービスを、自分で管理する公開 URL の背後に置くための小さなリバーストンネル CLI です。",
          description:
            "ノート PC やミニ PC、NAS、オフィスの機材で動くサービスに安定した公開 URL が必要でも、内向きのポートは開けたくない。そんな場面のための道具です。公開側に Proxer サーバーを 1 つ立て、プライベートなマシンから WebSocket トンネルで外向きに接続します。トンネルサーバーは他社のプラットフォームではなく、自分の VPS やホームラボのエッジに置きます。",
          points: [
            "プライベートネットワークへの内向きのポートを開けません",
            "HTTP、Server-Sent Events、WebSocket のアップグレードがそのまま通ります",
            "ホストルーティングが明示的で、未登録のホストは推測せず 404 を返します",
            "トンネルサーバーを自分が所有するインフラで動かせます",
          ],
          install: "npm install -g @tinyrack/proxer",
          license: "MIT",
          repoHref: `${GITHUB}/proxer`,
          siteHref: "https://proxer.tinyrack.net",
        },
      ],
    },
    start: {
      title: "ホームラボを始める",
      intro:
        "ラックもサーバー向けの予算も要りません。古いデスクトップ 1 台と一晩あれば、最初のサービスを動かせます。",
      steps: [
        {
          title: "ハードウェアを用意する",
          body: "使っていないデスクトップ、画面が壊れたノート PC、中古のミニ PC でかまいません。小さなマシンとその得失は、ここのレビューで扱っています。",
        },
        {
          title: "OS を選ぶ",
          body: "ドキュメントを読む気になれる Linux ディストリビューションなら十分です。サービス 1 つから始めれば、失敗してもその 1 つで済みます。",
        },
        {
          title: "本当に使うものを動かす",
          body: "写真のバックアップ、広告ブロック、パスワード管理、メモ、ゲームサーバーなど。毎日使うサービスを選ぶことが、マシンを手入れし続ける理由になります。",
        },
        {
          title: "詰まったら聞く",
          body: "フォーラムにはウィキがあり、同じ問題に取り組んでいる人がいます。早く抜け出せるかどうかが、趣味として続くか放置された箱になるかの分かれ目です。",
        },
      ],
    },
    community: {
      title: "作業が続く場所",
      intro:
        "レビューと構築の記録はここに書いています。それ以外はすべて公開された場所で進めています。",
      links: [
        {
          label: "フォーラム",
          href: FORUM,
          description: "ウィキがあり、構築中に詰まったときに質問できます。",
        },
        {
          label: "GitHub",
          href: GITHUB,
          description:
            "ここで公開しているツールと、このサイト自体のソースがあります。",
        },
        {
          label: "YouTube",
          href: YOUTUBE,
          description: "ハードウェアの紹介と組み立ての動画です。",
        },
      ],
    },
    latest: {
      title: "最新の記事",
      linkLabel: "ブログを読む",
      empty: "まだ記事がありません。",
    },
  },
};
