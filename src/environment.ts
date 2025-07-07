export const canUseDOM =
  typeof window !== 'undefined' &&
  window.document &&
  // eslint-disable-next-line @typescript-eslint/unbound-method
  window.document.createElement;
