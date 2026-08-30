import { TRLinkButton } from "@tinyrack/ui/components/link-button";
import { TRText } from "@tinyrack/ui/components/text";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import * as m from "@/i18n/paraglide/messages.js";
import { getOpenSourcePath } from "@/lib/routes.ts";
import { langFromPath } from "@/lib/site-page.ts";

export default function Products() {
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
            {m.products_eyebrow({}, messageOptions)}
          </TRText>
          <TRText
            as="h1"
            className="m-0 text-balance"
            variant="displayLg"
            weight="bold"
          >
            {m.products_title({}, messageOptions)}
          </TRText>
          <TRText
            as="p"
            className="mt-tinyrack-2xl max-w-tinyrack-measure-xl"
            color="muted"
            variant="body"
          >
            {m.products_description({}, messageOptions)}
          </TRText>
          <TRLinkButton
            className="mt-tinyrack-2xl"
            intent="primary"
            render={<Link to={getOpenSourcePath(lang)} />}
            uiSize="lg"
          >
            {m.products_cta({}, messageOptions)}
            <ArrowRight aria-hidden="true" />
          </TRLinkButton>
        </div>
      </section>
    </div>
  );
}
