'use client';

import { reportAccessibilityViolations } from '../../axe';

reportAccessibilityViolations();

export function BaseLayout({ children }: React.PropsWithChildren) {
  return children;
}
