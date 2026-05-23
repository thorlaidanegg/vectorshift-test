const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export const extractVariables = (text) => {
  const seen = new Set();
  for (const [, name] of text.matchAll(VAR_REGEX)) {
    seen.add(name);
  }
  return [...seen];
};
