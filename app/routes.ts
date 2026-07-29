import { resolve } from "node:path";
import {
  index,
  type RouteConfig,
  relative,
  route,
} from "@react-router/dev/routes";
import { planRoutes } from "./content/routes-plan.ts";
import { scanContent } from "./content/scan.ts";

const root = process.cwd();
const manifest = scanContent(root);
const content = relative(resolve(root, "content"));

function stripSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, "");
}

const routes: RouteConfig = planRoutes(manifest).map((entry) => {
  const path = stripSlashes(entry.path);

  if (entry.kind === "content") {
    return content.route(path, entry.routeFile as string, { id: entry.id });
  }

  if (entry.kind === "blog") {
    return route(path, "routes/blog.tsx", { id: entry.id });
  }

  if (entry.kind === "tag") {
    return route(path, "routes/tag.tsx", { id: entry.id });
  }

  if (entry.kind === "openSource") {
    return route(path, "routes/open-source.tsx", { id: entry.id });
  }

  if (entry.kind === "products") {
    return route(path, "routes/products.tsx", { id: entry.id });
  }

  return path === ""
    ? index("routes/home.tsx", { id: entry.id })
    : route(path, "routes/home.tsx", { id: entry.id });
});

export default routes;
