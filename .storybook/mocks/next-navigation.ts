// Mock next/navigation for Storybook browser environment
// This prevents "invariant expected app router to be mounted" errors

export function useRouter() {
  return {
    push: () => Promise.resolve(),
    replace: () => Promise.resolve(),
    prefetch: () => Promise.resolve(),
    back: () => {},
    forward: () => {},
    refresh: () => {},
  };
}

export function usePathname() {
  return "/";
}

export function useSearchParams() {
  return new URLSearchParams();
}

export function redirect() {
  // Mock redirect - do nothing in Storybook
}
