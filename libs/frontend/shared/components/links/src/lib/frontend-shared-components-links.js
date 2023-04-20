import Link from "@cloudscape-design/components/link";
import { useLink } from 'use-awsui-router';
import { externalLinkProps } from '@visionarea-admin/frontend/config';

export function NavLink({children, ...props}) {
  const { handleFollow } = useLink();

  return (
    <Link onFollow={handleFollow} {...props}>
      {children}
    </Link>
  );
}

export const InfoLink = ({ id, onFollow, ariaLabel }) => (
  <Link variant="info" id={id} onFollow={onFollow} ariaLabel={ariaLabel}>
    Info
  </Link>
);

// a special case of external link, to be used within a link group, where all of them are external
// and we do not repeat the icon
export const ExternalLinkItem = ({ href, text }) => (
  <Link href={href} ariaLabel={`${text} ${externalLinkProps.externalIconAriaLabel}`} target="_blank">
    {text}
  </Link>
);

export const CounterLink = ({ children }) => {
  return (
    <Link variant="awsui-value-large" href="#">
      {children}
    </Link>
  );
};