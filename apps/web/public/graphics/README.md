# Graphics Assets Guide

## Directory Structure
```
graphics/
├── header-bg.png          (900×260px) - Header background
├── header-bg-mobile.png   (mobile variant, optional)
└── icons/
    ├── ingredient-[id].png
    ├── sauce-[id].png
    ├── topping-[id].png
    └── premium-[id].png
```

## Specifications

### Header Background
- **Size:** 900px × 260px (desktop)
- **Mobile:** Responsive width × 260px height
- **Format:** PNG with transparency
- **Purpose:** Replaces current gradient header
- **Location:** `public/graphics/header-bg.png`

### Ingredient Icons
- **Size:** 44px × 44px
- **Format:** PNG with transparency
- **Background:** Transparent (will be placed on colored chips)
- **Style:** Centered, square format
- **Naming Convention:** `[category]-[ingredient-id].png`

**Categories:**
- `ingredient-[id].png` - Vegetables (40+ items)
- `sauce-[id].png` - Sauces (13 items)
- `topping-[id].png` - Primary extras/toppings (5 items)
- `premium-[id].png` - Premium/paid additions (11 items)

**Example IDs from menu:**
- ingredient-lettuce.png
- ingredient-tomato.png
- sauce-olive-oil.png
- sauce-tahini.png
- topping-egg.png
- premium-egg-paid.png
- premium-feta-paid.png

### Bowl Background (Optional)
- **Size:** 200px × 200px
- **Format:** PNG with transparency
- **Purpose:** Background graphic for bowl canvas
- **Location:** `public/graphics/bowl-bg.png`

## Implementation Notes
- All PNGs should use transparency (RGBA)
- Icons will be scaled to 44px on mobile, 48px on desktop
- Header background will be set as CSS background-image
- Fallback colors are in place if graphics fail to load
