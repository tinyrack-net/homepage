import { useLocation } from "react-router";
import { ArticleCard } from "@/components/ArticleCard.tsx";
import { t } from "@/i18n/index.ts";
import { SITE_DESCRIPTIONS, SITE_TITLES } from "@/lib/constants.ts";
import { getAllArticles } from "@/lib/content.ts";
import { langFromPath } from "@/lib/site-page.ts";

export default function Home() {
  const location = useLocation();
  const lang = langFromPath(location.pathname);
  const posts = getAllArticles().filter((post) => post.data.lang === lang);

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-tinyrack-2xl px-tinyrack-lg py-page-y">
      <section className="text-center">
        <h1 className="text-tinyrack-4xl font-bold">{SITE_TITLES[lang]}</h1>
        <p className="mx-auto mt-tinyrack-lg max-w-hero text-tinyrack-lg text-tinyrack-text-muted">
          {SITE_DESCRIPTIONS[lang]}
        </p>
      </section>
      <section>
        <h2 className="text-tinyrack-2xl font-bold">
          {t(lang, "home.latest")}
        </h2>
        <ul className="mt-tinyrack-xl grid gap-tinyrack-2xl md:grid-cols-2">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </ul>
      </section>
    </div>
  );
}
