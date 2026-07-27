import dotweaveIconUrl from "@tinyrack/ui/brand/apps/dotweave-app-icon.svg";
import tinyauthIconUrl from "@tinyrack/ui/brand/apps/tinyauth-app-icon.svg";
import { TRCard } from "@tinyrack/ui/components/card";
import { TRLink } from "@tinyrack/ui/components/link";
import { TRLinkButton } from "@tinyrack/ui/components/link-button";
import { TRText } from "@tinyrack/ui/components/text";
import {
  ArrowUpRight,
  Blocks,
  Code2,
  Network,
  Package,
  Star,
} from "lucide-react";
import type { ReactNode } from "react";
import { useLocation } from "react-router";
import {
  OPEN_SOURCE_PROJECTS,
  type OpenSourceProject,
  openSourceCopy,
} from "@/content/open-source.ts";
import { LINKS } from "@/lib/constants.ts";
import { langFromPath } from "@/lib/site-page.ts";

function ProjectIcon({ project }: { project: OpenSourceProject }): ReactNode {
  if (project.id === "dotweave") {
    return (
      <img
        alt=""
        className="size-tinyrack-control-height-md rounded-tinyrack-sm"
        src={dotweaveIconUrl}
      />
    );
  }

  if (project.id === "tinyauth") {
    return (
      <img
        alt=""
        className="size-tinyrack-control-height-md rounded-tinyrack-sm"
        src={tinyauthIconUrl}
      />
    );
  }

  const Icon =
    project.id === "proxer"
      ? Network
      : project.id === "design"
        ? Blocks
        : Package;
  return (
    <Icon
      aria-hidden="true"
      className="size-tinyrack-control-height-md text-tinyrack-text-muted"
      strokeWidth={1.5}
    />
  );
}

function ProjectCard({
  lang,
  project,
  repositoryLabel,
  starsLabel,
}: {
  lang: ReturnType<typeof langFromPath>;
  project: OpenSourceProject;
  repositoryLabel: string;
  starsLabel: string;
}) {
  const repositoryPath = new URL(project.repository).pathname.replace(
    /^\//,
    "",
  );

  return (
    <li className="flex min-w-0" data-open-source-project={project.id}>
      <TRLink
        aria-label={`${project.name}: ${repositoryLabel}`}
        className="group block w-full"
        href={project.repository}
        rel="noopener noreferrer"
        target="_blank"
        underline="none"
      >
        <TRCard.Root
          className="relative flex h-full flex-col transition-colors group-hover:border-tinyrack-border-strong group-hover:bg-tinyrack-surface"
          padding="lg"
          variant="outlined"
        >
          <TRCard.Header className="pr-tinyrack-2xl">
            <div className="flex min-w-0 items-center gap-tinyrack-md">
              <ProjectIcon project={project} />
              <TRCard.Title
                // biome-ignore lint/a11y/useHeadingContent: Base UI injects the title content into this render slot.
                render={<h3 />}
              >
                {project.name}
              </TRCard.Title>
            </div>
          </TRCard.Header>
          <ArrowUpRight
            aria-hidden="true"
            className="absolute right-tinyrack-lg top-tinyrack-lg size-tinyrack-control-height-sm shrink-0 text-tinyrack-text-muted transition-colors group-hover:text-tinyrack-text"
          />

          <TRCard.Description className="mt-tinyrack-md line-clamp-3">
            {project.descriptions[lang]}
          </TRCard.Description>

          <TRCard.Footer className="mt-auto border-t border-tinyrack-border pt-tinyrack-md">
            <TRText
              aria-label={`${repositoryLabel}: ${repositoryPath}`}
              className="min-w-0 flex-1 truncate"
              color="muted"
              variant="code"
            >
              {repositoryPath}
            </TRText>
            <TRText
              aria-label={`${starsLabel}: ${project.stars}`}
              className="flex shrink-0 items-center gap-tinyrack-xs"
              color="muted"
              variant="caption"
            >
              <Star aria-hidden="true" className="size-tinyrack-sm" />
              {project.stars}
            </TRText>
            <TRText className="shrink-0" color="muted" variant="caption">
              {project.language}
            </TRText>
          </TRCard.Footer>
        </TRCard.Root>
      </TRLink>
    </li>
  );
}

export default function OpenSource() {
  const location = useLocation();
  const lang = langFromPath(location.pathname);
  const copy = openSourceCopy[lang];

  return (
    <div className="wide-shell">
      <section className="py-tinyrack-3xl">
        <div className="max-w-tinyrack-reading-sm">
          <TRText
            as="p"
            className="mb-tinyrack-xl uppercase"
            color="muted"
            variant="label"
          >
            {copy.hero.eyebrow}
          </TRText>
          <TRText
            as="h1"
            className="max-w-tinyrack-reading-sm text-balance"
            variant="displayLg"
            weight="bold"
          >
            {copy.hero.title}
          </TRText>
          <TRText
            as="p"
            className="mt-tinyrack-2xl max-w-prose"
            color="muted"
            variant="body"
          >
            {copy.hero.description}
          </TRText>
          <TRLinkButton
            className="mt-tinyrack-2xl"
            href={LINKS.GITHUB}
            intent="primary"
            rel="noopener noreferrer"
            target="_blank"
            uiSize="lg"
          >
            <Code2 aria-hidden="true" />
            {copy.hero.ctaLabel}
          </TRLinkButton>
        </div>
      </section>

      <section className="border-t border-tinyrack-border py-tinyrack-2xl">
        <TRText
          as="h2"
          className="mb-tinyrack-xl uppercase"
          color="muted"
          variant="label"
        >
          {copy.projectsTitle}
        </TRText>
        <ul
          className="grid gap-tinyrack-lg md:grid-cols-2 xl:grid-cols-3"
          data-open-source-project-grid
        >
          {OPEN_SOURCE_PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              lang={lang}
              project={project}
              repositoryLabel={copy.repositoryLabel}
              starsLabel={copy.starsLabel}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
