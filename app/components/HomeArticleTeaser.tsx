import { TRText } from "@tinyrack/ui/components/text";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import type { ArticleEntry } from "@/lib/content-types.ts";
import { getContentPath } from "@/lib/routes.ts";
import { TextDate } from "./TextDate.tsx";

export function HomeArticleTeaser({
  featured = false,
  post,
  label,
}: {
  featured?: boolean;
  label?: string;
  post: ArticleEntry;
}) {
  const href = getContentPath(post.data.lang, post.data.routeSlug);

  return (
    <li
      className={featured ? "min-w-0 md:col-span-2" : "min-w-0"}
      data-home-article-featured={featured ? true : undefined}
      data-home-article-teaser
    >
      <Link
        className={`home-article-link group block text-tinyrack-text no-underline${featured ? " rounded-tinyrack-lg bg-tinyrack-surface-muted p-tinyrack-md md:p-tinyrack-lg" : ""}`}
        data-home-article-link
        to={href}
      >
        {post.data.featureImage ? (
          <div className="aspect-video w-full overflow-hidden rounded-tinyrack-md bg-tinyrack-surface">
            <img
              alt=""
              className="h-full w-full object-cover"
              data-home-article-image
              loading="lazy"
              src={post.data.featureImage}
            />
          </div>
        ) : null}
        <div className="mt-tinyrack-lg flex items-start justify-between gap-tinyrack-lg">
          <div className="min-w-0">
            {featured && label ? (
              <TRText
                as="p"
                className="m-0 mb-tinyrack-sm"
                color="muted"
                variant="label"
              >
                {label}
              </TRText>
            ) : null}
            <TRText
              as="h3"
              className="m-0 text-balance group-hover:underline"
              variant="headingSm"
              weight="heading"
            >
              {post.data.title}
            </TRText>
            {featured ? (
              <TRText
                as="p"
                className="mt-tinyrack-md mb-0 line-clamp-3 max-w-tinyrack-measure-xl"
                color="muted"
                variant="body"
              >
                {post.data.excerpt}
              </TRText>
            ) : null}
            <TextDate
              className="mt-tinyrack-sm block"
              date={post.data.publishedAt}
              lang={post.data.lang}
            />
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-tinyrack-xs shrink-0 text-tinyrack-text-muted"
          />
        </div>
      </Link>
    </li>
  );
}
