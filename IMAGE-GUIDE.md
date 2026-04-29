# 🖼️ D'NINJA — Image Catalog System

## How It Works (Zero Code Required!)

Your website automatically displays images from these folders. **No code changes needed** — just save your files and run the sync!

---

## 📁 Folder Structure

```
images/
├── branding/          → Branding catalog page
├── socialmedia/       → Social Media catalog page
├── poster/            → Poster & Banner catalog page
├── thumbnail/         → Thumbnail catalog page
├── logo/              → Logo catalog page
├── invitation/        → Invitation Card catalog page
└── icard/             → I-Card catalog page
```

---

## 🚀 Adding New Designs (3 Simple Steps)

### Step 1: Save Your Image
Drop your design into the matching folder:
- Logo design? → Save to `images/logo/`
- Social media post? → Save to `images/socialmedia/`
- New branding? → Save to `images/branding/`
- ...and so on

### Step 2: Name Your File
The **filename becomes the display name** on the website!

| Filename                        | Displayed As               |
|---------------------------------|----------------------------|
| `my-cool-logo.jpg`             | My Cool Logo               |
| `wedding_card_design.png`      | Wedding Card Design        |
| `brand-identity-v2.jpg`        | Brand Identity V2          |
| `instagram-post-summer.png`    | Instagram Post Summer      |
| `cafe-menu-poster.webp`        | Cafe Menu Poster           |

**Rules:**
- Use **dashes** (`-`) or **underscores** (`_`) to separate words
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- Avoid special characters like `!`, `@`, `#`, etc.

### Step 3: Run Sync
Double-click **`Sync-Images.bat`** — that's it! ✅

The website will now show your new images with their names below.

---

## 🎨 Cover Images (Homepage Thumbnails)

Each category on the homepage shows a cover image. To set one:

Save a file named `<folder>-cover.png` in the category folder:
- `images/branding/branding-cover.png`
- `images/logo/logo-cover.png`
- `images/socialmedia/socialmedia-cover.png`
- etc.

> Cover images are **NOT shown** in the gallery — they're only for the homepage preview.

---

## 📋 Quick Reference

| Action                          | What To Do                                          |
|---------------------------------|-----------------------------------------------------|
| Add a new design                | Save image to the right folder → Run Sync-Images.bat |
| Change display name             | Rename the file → Run Sync-Images.bat                |
| Remove a design                 | Delete the image file → Run Sync-Images.bat          |
| Set homepage cover              | Save as `<folder>-cover.png`                         |
| Add a new category              | Create new folder in `images/` + create catalog HTML |

---

## ⚠️ Important Notes

1. **Always run `Sync-Images.bat`** after adding/removing/renaming images
2. Files with `guide` in the name are automatically skipped
3. Cover images (`*-cover.png/jpg/webp`) are automatically skipped from galleries
4. Images are sorted alphabetically by filename
