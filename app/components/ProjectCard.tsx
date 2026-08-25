import dotweaveIconUrl from "@tinyrack/ui/brand/apps/dotweave-app-icon.svg";
import tinyauthIconUrl from "@tinyrack/ui/brand/apps/tinyauth-app-icon.svg";
import { TRCard } from "@tinyrack/ui/components/card";
import { TRLink } from "@tinyrack/ui/components/link";
import { TRText } from "@tinyrack/ui/components/text";
import { ArrowUpRight, Blocks, Network, Package, Star } from "lucide-react";
import type { ReactNode } from "react";
import type { OpenSourceProject } from "@/content/open-source.ts";
import type { SupportedLanguageCodes } from "@/lib/language.ts";

export function ProjectIcon({
  project,
}: {
  project: OpenSourceProject;
}): ReactNode {
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

export function ProjectCard({
  lang,
  project,
  repositoryLabel,
  starsLabel,
}: {
  lang: SupportedLanguageCodes;
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
          padding="none"
          variant="outlined"
        >
          <div className="flex flex-1 flex-col p-tinyrack-lg">
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

            <TRCard.Description className="mt-tinyrack-md line-clamp-3">
              {project.descriptions[lang]}
            </TRCard.Description>
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="absolute right-tinyrack-lg top-tinyrack-lg size-tinyrack-control-height-sm shrink-0 text-tinyrack-text-muted transition-colors group-hover:text-tinyrack-text"
          />

          <TRCard.Footer className="border-t-tinyrack-default border-tinyrack-border px-tinyrack-lg py-tinyrack-lg">
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
