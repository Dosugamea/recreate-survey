import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// R2 キャッシュを利用する場合は以下のコメントを解除してください
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // incrementalCache: r2IncrementalCache,
});
