import { TRText } from "@tinyrack/ui/components/text";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import type { ArticleEntry } from "@/lib/content-types.ts";
import { getContentPath } from "@/lib/routes.ts";
import { TextDate } from "./TextDate.tsx";

export function HomeArticleTeaser({ post }: { post: ArticleEntry }) {
  const href = getContentPath(post.data.lang, post.data.routeSlug);

  return (
    <li className="min-w-0" data-home-article-teaser>
      <Link
        className="home-article-link group block text-tinyrack-text no-underline"
        data-home-article-link
        to={href}
      >
        {post.data.featureImage ? (
          <div className="aspect-video w-full overflow-hidden rounded-tinyrack-md bg-tinyrack-surface-muted">
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
            <TRText
              as="h3"
              className="m-0 text-balance group-hover:underline"
              variant="headingSm"
              weight="heading"
            >
              {post.data.title}
            </TRText>
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
