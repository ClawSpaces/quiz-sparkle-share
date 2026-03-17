

## Plan

Two tasks to complete:

### 1. Update favicon

- Copy the uploaded `favicon.png` to `public/favicon.png`
- Update `index.html` to reference it: `<link rel="icon" href="/favicon.png" type="image/png">`

### 2. Fix broken image for "This TikTok House Cleaning Hack Is Genius"

The post (ID: `293f2cfd-2940-4f03-916e-1adb9f12c3e0`) currently has image URL `photo-1628172905343-4c921356f11c` which appears broken in the preview. 

I will invoke the `generate-cover-images` edge function targeting just this post to generate a unique AI cover image and store it in the `cover-images` bucket. Alternatively, if generation quota is still limited, I will update the database directly with a verified working Unsplash image related to house cleaning (e.g., `photo-1581578731548-c64695cc6952` - cleaning supplies).

### Files to modify
- `index.html` -- add favicon link
- `public/favicon.png` -- copy from upload

