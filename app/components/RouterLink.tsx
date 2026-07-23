import { TRLink, type TRLinkProps } from "@tinyrack/ui/components/link";
import { Link } from "react-router";

export type RouterLinkProps = Omit<TRLinkProps, "href" | "render"> & {
  to: string;
};

/** A design-system link that navigates with the React Router client router. */
export function RouterLink({ to, ...props }: RouterLinkProps) {
  return <TRLink {...props} render={<Link to={to} />} />;
}
