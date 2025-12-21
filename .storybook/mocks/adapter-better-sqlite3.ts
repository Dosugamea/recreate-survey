// Mock PrismaBetterSqlite3 adapter for Storybook browser environment
// This prevents better-sqlite3 from being loaded in the browser

export class PrismaBetterSqlite3 {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_options: { url?: string }) {
    // Mock constructor - do nothing
  }
}
