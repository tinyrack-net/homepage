import { TRLinkButton } from "@tinyrack/ui/components/link-button";
import { TRText } from "@tinyrack/ui/components/text";
import { Code2 } from "lucide-react";
import { useLocation } from "react-router";
import { ProjectCard } from "@/components/ProjectCard.tsx";
import { OPEN_SOURCE_PROJECTS, openSourceCopy } from "@/content/open-source.ts";
import { LINKS } from "@/lib/constants.ts";
import { langFromPath } from "@/lib/site-page.ts";

export default function OpenSource() {
  const location = useLocation();
  const lang = langFromPath(location.pathname);
  const copy = openSourceCopy[lang];

  return (
    <div className="wide-shell">
      <section className="py-tinyrack-3xl">
        <div className="max-w-tinyrack-measure-xl">
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
            className="max-w-tinyrack-measure-xl text-balance"
            variant="displayLg"
            weight="bold"
          >
            {copy.hero.title}
          </TRText>
          <TRText
            as="p"
            className="mt-tinyrack-2xl max-w-tinyrack-measure-xl"
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

      <section className="border-t-tinyrack-default border-tinyrack-border py-tinyrack-2xl">
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
