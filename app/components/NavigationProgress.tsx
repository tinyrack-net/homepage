"use client";

import { TRProgress } from "@tinyrack/ui/components/progress";
import { useLocation, useNavigation } from "react-router";
import * as m from "@/i18n/paraglide/messages.js";
import { langFromPath } from "@/lib/language.ts";

/** The docs-style indeterminate bar shown while a client route is changing. */
export function NavigationProgress() {
  const location = useLocation();
  const navigation = useNavigation();
  const pendingPath = navigation.location?.pathname;

  if (pendingPath === undefined || pendingPath === location.pathname) {
    return null;
  }

  const lang = langFromPath(location.pathname);

  return (
    <TRProgress.Root
      className="site-navigation-progress"
      uiSize="md"
      value={null}
    >
      <TRProgress.Label className="site-navigation-progress-label">
        {m.navigation_loading({}, { locale: lang })}
      </TRProgress.Label>
      <TRProgress.Track>
        <TRProgress.Indicator />
      </TRProgress.Track>
    </TRProgress.Root>
  );
}
