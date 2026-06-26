// Fixed category list for QuickBasket.
// Using direct, stable Unsplash CDN photo URLs (no API key needed, free to hotlink under Unsplash License).
// If any image ever breaks, just swap the `image` value for that category.

export const CATEGORIES = [
  {
    name: "Fruits",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Dairy",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Bakery",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Beverages",
    image:
      "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Snacks",
    image:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Grocery",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Spices",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Personal Care",
    image:
      "https://images.unsplash.com/photo-1556228852-6d35a585d566?w=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Household",
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80&auto=format&fit=crop",
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const getCategoryImage = (name) =>
  CATEGORIES.find((c) => c.name === name)?.image || null;
