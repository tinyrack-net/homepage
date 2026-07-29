import { TRLinkButton } from "@tinyrack/ui/components/link-button";
import { TRText } from "@tinyrack/ui/components/text";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { productsCopy } from "@/content/products.ts";
import { getOpenSourcePath } from "@/lib/routes.ts";
import { langFromPath } from "@/lib/site-page.ts";

export default function Products() {
  const location = useLocation();
  const lang = langFromPath(location.pathname);
  const copy = productsCopy[lang];

  return (
    <div className="wide-shell">
      <section className="py-tinyrack-4xl md:py-tinyrack-5xl">
        <div className="max-w-tinyrack-reading-sm">
          <TRText
            as="p"
            className="mb-tinyrack-xl uppercase"
            color="muted"
            variant="label"
          >
            {copy.eyebrow}
          </TRText>
          <TRText
            as="h1"
            className="m-0 text-balance"
            variant="displayLg"
            weight="bold"
          >
            {copy.title}
          </TRText>
          <TRText
            as="p"
            className="mt-tinyrack-2xl max-w-prose"
            color="muted"
            variant="body"
          >
            {copy.description}
          </TRText>
          <TRLinkButton
            className="mt-tinyrack-2xl"
            intent="primary"
            render={<Link to={getOpenSourcePath(lang)} />}
            uiSize="lg"
          >
            {copy.ctaLabel}
            <ArrowRight aria-hidden="true" />
          </TRLinkButton>
        </div>
      </section>
    </div>
  );
}
