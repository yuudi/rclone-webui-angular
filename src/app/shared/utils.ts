export const trimEnding = (s: string, ending: string): string => {
  if (s.endsWith(ending)) {
    return s.slice(0, -ending.length);
  }
  return s;
};
