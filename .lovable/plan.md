

## Problem

Many posts share identical Unsplash cover images. For example, `photo-1529156069898` (group of friends) is used by at least 7 different posts, `photo-1507679799987` by 3+ posts, and `photo-1456513080510` and `photo-1556228578` by 2 each. This makes the site look repetitive.

## Solution

Use the existing `generate-cover-images` edge function with `replace_all_unsplash = true` mode to replace all Unsplash URLs on posts with unique AI-generated cover images stored in the `cover-images` storage bucket.

The function already supports this -- it will:
1. Mark all Unsplash URLs as "broken"
2. Generate a unique AI image per post based on its title
3. Upload to storage and update the database

### What needs to happen

**No code changes needed.** The existing edge function handles this. I will invoke it multiple times (it processes `max_fix` items per call) with these parameters:

```json
{
  "table": "posts",
  "offset": 0,
  "limit": 50,
  "max_fix": 5,
  "replace_all_unsplash": true
}
```

This will be called repeatedly (incrementing through batches) until all ~25 posts with duplicate Unsplash images have unique AI-generated covers. Each call generates up to 5 images to stay within timeout limits.

### Estimated scope
- ~25 posts need new images
- ~5 invocations of the edge function (5 images each)
- Images stored permanently in the `cover-images/posts/` bucket path

