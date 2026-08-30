import { TRLinkButton } from "@tinyrack/ui/components/link-button";
import { TRText } from "@tinyrack/ui/components/text";
import { Code2 } from "lucide-react";
import { useLocation } from "react-router";
import { ProjectCard } from "@/components/ProjectCard.tsx";
import { OPEN_SOURCE_PROJECTS } from "@/content/open-source.ts";
import * as m from "@/i18n/paraglide/messages.js";
import { LINKS } from "@/lib/constants.ts";
import { langFromPath } from "@/lib/site-page.ts";

export default function OpenSource() {
  const location = useLocation();
  const lang = langFromPath(location.pathname);
  const messageOptions = { locale: lang } as const;

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
            {m.open_source_hero_eyebrow({}, messageOptions)}
          </TRText>
          <TRText
            as="h1"
            className="max-w-tinyrack-measure-xl text-balance"
            variant="displayLg"
            weight="bold"
          >
            {m.open_source_hero_title({}, messageOptions)}
          </TRText>
          <TRText
            as="p"
            className="mt-tinyrack-2xl max-w-tinyrack-measure-xl"
            color="muted"
            variant="body"
          >
            {m.open_source_hero_description({}, messageOptions)}
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
            {m.open_source_hero_cta({}, messageOptions)}
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
          {m.open_source_projects_title({}, messageOptions)}
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
              repositoryLabel={m.open_source_repository_label(
                {},
                messageOptions,
              )}
              starsLabel={m.open_source_stars_label({}, messageOptions)}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
