'use client';

import { reportAccessibilityViolations } from '../../axe';

void reportAccessibilityViolations();

export function BaseLayout({ children }: React.PropsWithChildren) {
  return children;
}
