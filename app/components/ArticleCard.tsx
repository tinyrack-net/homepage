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
    <li>
      <Link className="group flex flex-col no-underline" to={href}>
        {post.data.featureImage ? (
          <img
            alt={post.data.title}
            className="aspect-video w-full rounded-tinyrack-xl object-cover transition group-hover:opacity-90"
            loading="lazy"
            src={post.data.featureImage}
          />
        ) : null}
        <h3 className="mt-tinyrack-lg text-tinyrack-xl font-bold text-tinyrack-text group-hover:underline">
          {post.data.title}
        </h3>
        <TextDate
          className="mt-tinyrack-sm"
          date={post.data.publishedAt}
          lang={post.data.lang}
        />
        {showExcerpt ? (
          <p className="mt-tinyrack-md line-clamp-3 text-tinyrack-text-muted">
            {post.data.excerpt}
          </p>
        ) : null}
      </Link>
    </li>
  );
}
