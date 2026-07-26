import { TRCard } from "@tinyrack/ui/components/card";
import { Link } from "react-router";
import type { ArticleEntry } from "@/lib/content-types.ts";
import { getContentPath } from "@/lib/routes.ts";
import { TextDate } from "./TextDate.tsx";

export type ArticleCardProps = {
  post: ArticleEntry;
  showExcerpt?: boolean;
};

export function ArticleCard({ post, showExcerpt = true }: ArticleCardProps) {
  const href = getContentPath(post.data.lang, post.data.routeSlug);

  return (
    <li className="flex">
      <TRCard.Root
        className="group relative flex w-full flex-col overflow-hidden transition-colors hover:border-tinyrack-border-strong"
        padding="none"
        variant="outlined"
      >
        {post.data.featureImage ? (
          // Decorative: the title link right below carries the accessible name.
          <img
            alt=""
            className="aspect-video w-full object-cover"
            loading="lazy"
            src={post.data.featureImage}
          />
        ) : null}
        <TRCard.Content className="flex flex-1 flex-col gap-tinyrack-sm p-tinyrack-lg">
          {/* Cards sit under a section h2, so the title is an h3. */}
          <TRCard.Title
            className="text-tinyrack-xl font-bold"
            // biome-ignore lint/a11y/useHeadingContent: Base UI injects the title content into this render slot.
            render={<h3 />}
          >
            {/* The pseudo-element stretches the hit area over the whole card
                while keeping exactly one link in the accessibility tree. */}
            <Link
              className="text-tinyrack-text no-underline before:absolute before:inset-0 group-hover:underline"
              to={href}
            >
              {post.data.title}
            </Link>
          </TRCard.Title>
          <TextDate date={post.data.publishedAt} lang={post.data.lang} />
          {showExcerpt ? (
            <TRCard.Description className="line-clamp-3 text-tinyrack-text-muted">
              {post.data.excerpt}
            </TRCard.Description>
          ) : null}
        </TRCard.Content>
      </TRCard.Root>
    </li>
  );
}
