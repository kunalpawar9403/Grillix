export const USER_PROFILE = {
  name: "Jhon Snow",
  handle: "@shahinurstk02",
  email: "shahinurstk02@gmail.com",
  avatar: "/images/avatar-jhon.jpg",
  points: 3500,
  homePointsDisplay: 32,
  address: "Center Drive #E160 Lone Tree, CO 80124",
  tier: "Gold Tier Member",
  ordersCount: 24,
  favoriteKitchen: "Park Meadows Kitchen"
};

export const FOOD_ITEMS = [
  {
    id: "green-veggie-bowl",
    name: "Green Veggie Bowl",
    shortName: "Greens Bowl",
    tagline: "Broccoli & Spinach Delight",
    description: "Steamed broccoli florets, baby spinach, garden sweet peas, edamame, and cracked black pepper tossed in cold-pressed Meyer lemon extra virgin olive oil.",
    menuPrice: 12.75,
    calories: 800,
    ingredientCount: 12,
    deliveryTime: "55m",
    category: "Featured",
    categories: ["Featured", "Salads", "Bowls", "Warm Bowls"],
    badge: "Chef's Signature",
    dietary: ["Organic", "Vegan", "Gluten-Free"],
    image: "/images/green-veggie-bowl.jpg",
    ingredients: [
      { id: "broccoli", name: "Broccoli", image: "/images/broccoli-ingredient.jpg", amount: "150g fresh florets" },
      { id: "brassica", name: "Brassica", image: "/images/brassica-ingredient.jpg", amount: "Tender kale leaves" },
      { id: "spinach", name: "Spinach", image: "/images/spinach-ingredient.jpg", amount: "Organic baby spinach" },
      { id: "peas", name: "Sweet Peas", image: "/images/green-veggie-bowl.jpg", amount: "Steamed sweet peas" },
      { id: "mint", name: "Fresh Mint", image: "/images/hero-spinach.jpg", amount: "Garden aromatic herbs" }
    ],
    nutrition: {
      protein: "24g",
      carbs: "45g",
      fiber: "14g",
      fat: "18g"
    }
  },
  {
    id: "rainbow-veggie-quinoa",
    name: "Rainbow Veggie Quinoa Power Bowl",
    shortName: "Rainbow Veggie",
    tagline: "High-Protein Superfood Bowl",
    description: "Sliced grilled herb chicken breast, fluffy tri-color quinoa, roasted cherry tomatoes, Haas avocado, shredded kale, and warm cilantro lime tahini.",
    menuPrice: 14.75,
    calories: 680,
    ingredientCount: 9,
    deliveryTime: "40m",
    category: "Protein Plates",
    categories: ["Featured", "Protein Plates", "Bowls", "Warm Bowls"],
    badge: "High Protein • 42g",
    dietary: ["High Protein", "Gluten-Free", "Non-GMO"],
    image: "/images/rainbow-quinoa-bowl.jpg",
    ingredients: [
      { id: "chicken", name: "Roasted Chicken", image: "/images/rainbow-quinoa-bowl.jpg", amount: "120g free-range breast" },
      { id: "quinoa", name: "Herbed Quinoa", image: "/images/rainbow-quinoa-bowl.jpg", amount: "Organic tri-color" },
      { id: "avocado", name: "Hass Avocado", image: "/images/herb-bean-sandwich.jpg", amount: "Half fresh avocado" },
      { id: "kale", name: "Shredded Kale", image: "/images/brassica-ingredient.jpg", amount: "Massaged lemon kale" }
    ],
    nutrition: {
      protein: "42g",
      carbs: "52g",
      fiber: "11g",
      fat: "16g"
    }
  },
  {
    id: "salmon-wild-rice",
    name: "Miso Glazed Salmon & Warm Wild Rice",
    shortName: "Miso Salmon Bowl",
    tagline: "Wild Alaskan Omega-3 Plate",
    description: "Pan-seared wild salmon with a sweet white miso glaze, served over wild black rice, blanched asparagus spears, pickled red cabbage, and sesame seeds.",
    menuPrice: 16.50,
    calories: 620,
    ingredientCount: 10,
    deliveryTime: "35m",
    category: "Protein Plates",
    categories: ["Featured", "Protein Plates", "Warm Bowls"],
    badge: "Wild Caught",
    dietary: ["High Protein", "Dairy-Free", "Omega-3 Rich"],
    image: "/images/salmon-wild-rice.jpg",
    ingredients: [
      { id: "salmon", name: "Wild Salmon", image: "/images/salmon-wild-rice.jpg", amount: "140g wild caught fillet" },
      { id: "rice", name: "Wild Black Rice", image: "/images/salmon-wild-rice.jpg", amount: "Ancient forbidden rice" },
      { id: "asparagus", name: "Baby Asparagus", image: "/images/springtime-greens.jpg", amount: "Tender green spears" }
    ],
    nutrition: {
      protein: "38g",
      carbs: "46g",
      fiber: "8g",
      fat: "20g"
    }
  },
  {
    id: "crispy-tofu-bowl",
    name: "Golden Sesame Crispy Tofu Bowl",
    shortName: "Crispy Tofu",
    tagline: "100% Plant-Powered Protein",
    description: "Air-crisped organic non-GMO tofu glazed in toasted sesame tamari, tender broccoli florets, edamame pods, grated ginger, and organic brown rice.",
    menuPrice: 12.95,
    calories: 520,
    ingredientCount: 11,
    deliveryTime: "30m",
    category: "Protein Plates",
    categories: ["Featured", "Protein Plates", "Bowls", "Warm Bowls"],
    badge: "100% Vegan",
    dietary: ["Vegan", "Organic", "Non-GMO"],
    image: "/images/crispy-tofu.jpg",
    ingredients: [
      { id: "tofu", name: "Organic Tofu", image: "/images/tofu-ingredient.jpg", amount: "Firm sprouted soy cake" },
      { id: "broccoli", name: "Broccoli", image: "/images/broccoli-ingredient.jpg", amount: "Crisp steamed florets" },
      { id: "edamame", name: "Edamame", image: "/images/green-veggie-bowl.jpg", amount: "Shelled sweet soybeans" }
    ],
    nutrition: {
      protein: "26g",
      carbs: "54g",
      fiber: "13g",
      fat: "14g"
    }
  },
  {
    id: "avocado-citrus-bowl",
    name: "Avocado Citrus & Baby Fennel Salad",
    shortName: "Avocado Citrus",
    tagline: "Sunny California Harvest",
    description: "Hass avocado wedges, ruby red grapefruit segments, shaved baby fennel, wild baby arugula, toasted pumpkin seeds, and citrus poppy dressing.",
    menuPrice: 11.95,
    calories: 460,
    ingredientCount: 8,
    deliveryTime: "25m",
    category: "Salads",
    categories: ["Featured", "Salads"],
    badge: "Hydrating & Crisp",
    dietary: ["Vegan", "Gluten-Free", "Raw Food"],
    image: "/images/avocado-citrus-bowl.jpg",
    ingredients: [
      { id: "avocado", name: "Hass Avocado", image: "/images/avocado-citrus-bowl.jpg", amount: "Fresh ripe slices" },
      { id: "grapefruit", name: "Ruby Grapefruit", image: "/images/avocado-citrus-bowl.jpg", amount: "Fresh citrus suprêmes" },
      { id: "greens", name: "Wild Greens", image: "/images/spinach-ingredient.jpg", amount: "Baby arugula blend" }
    ],
    nutrition: {
      protein: "9g",
      carbs: "34g",
      fiber: "14g",
      fat: "22g"
    }
  },
  {
    id: "herb-bean-sandwich",
    name: "Herb & Bean Patty Sandwich",
    shortName: "Herb & Bean",
    tagline: "Herb & Bean Patty Sandwich",
    description: "House-made black bean & herbed quinoa patty with garlic roasted peppers, Hass avocado, wild arugula, and green tahini on grilled sourdough.",
    menuPrice: 11.50,
    calories: 550,
    ingredientCount: 8,
    deliveryTime: "30m",
    category: "Featured",
    categories: ["Featured", "Sandwiches"],
    badge: "Handheld Favorite",
    dietary: ["Vegetarian", "Dairy-Free"],
    image: "/images/herb-bean-sandwich.jpg",
    ingredients: [
      { id: "patty", name: "Bean Patty", image: "/images/herb-bean-sandwich.jpg", amount: "Grilled legume cake" },
      { id: "sourdough", name: "Artisan Bread", image: "/images/herb-bean-sandwich.jpg", amount: "Toasted sourdough" },
      { id: "spinach", name: "Spinach", image: "/images/spinach-ingredient.jpg", amount: "Organic greens" }
    ],
    nutrition: {
      protein: "22g",
      carbs: "64g",
      fiber: "16g",
      fat: "14g"
    }
  },
  {
    id: "fresh-salad-bowl",
    name: "Mediterranean Chickpea Salad",
    shortName: "Springtime Greens",
    tagline: "Springtime Greens Plate",
    description: "Crisp organic romaine, Persian cucumbers, vine tomatoes, spiced chickpeas, Kalamata olives, and cold-pressed citrus vinaigrette.",
    menuPrice: 10.50,
    calories: 480,
    ingredientCount: 10,
    deliveryTime: "35m",
    category: "Salads",
    categories: ["Featured", "Salads"],
    badge: "Mediterranean Diet",
    dietary: ["Vegan", "Gluten-Free"],
    image: "/images/fresh-salad-bowl.jpg",
    ingredients: [
      { id: "chickpeas", name: "Spiced Chickpeas", image: "/images/fresh-salad-bowl.jpg", amount: "Roasted organic" },
      { id: "spinach", name: "Baby Greens", image: "/images/spinach-ingredient.jpg", amount: "Tender wild greens" },
      { id: "lemon", name: "Meyer Lemon", image: "/images/fresh-salad-bowl.jpg", amount: "Fresh citrus dressing" }
    ],
    nutrition: {
      protein: "16g",
      carbs: "38g",
      fiber: "12g",
      fat: "19g"
    }
  },
  {
    id: "green-detox-smoothie",
    name: "Matcha Glow Green Detox Smoothie",
    shortName: "Green Glow Smoothie",
    tagline: "Cold-Pressed Superfood Drink",
    description: "Ceremonial Japanese matcha, organic spinach, crisp green apple, English cucumber, coconut water, and cold-pressed ginger root.",
    menuPrice: 8.50,
    calories: 190,
    ingredientCount: 6,
    deliveryTime: "20m",
    category: "Smoothies & Juices",
    categories: ["Featured", "Smoothies & Juices"],
    badge: "Immunity Booster",
    dietary: ["Raw Juice", "Zero Added Sugar", "Vegan"],
    image: "/images/green-detox-smoothie.jpg",
    ingredients: [
      { id: "matcha", name: "Ceremonial Matcha", image: "/images/green-detox-smoothie.jpg", amount: "Stone-ground green tea" },
      { id: "spinach", name: "Fresh Spinach", image: "/images/spinach-ingredient.jpg", amount: "Cold-pressed baby leaves" },
      { id: "cucumber", name: "Cucumber", image: "/images/green-veggie-bowl.jpg", amount: "Hydrating hydration base" }
    ],
    nutrition: {
      protein: "5g",
      carbs: "32g",
      fiber: "7g",
      fat: "2g"
    }
  },
  {
    id: "acai-superfood-cup",
    name: "Wild Berry Acai & Chia Superfood Cup",
    shortName: "Berry Acai Bowl",
    tagline: "Antioxidant Energy Bowl",
    description: "Wild organic Amazonian acai puree blended with blueberries and banana, topped with hemp seed granola, chia seeds, fresh strawberries, and raw honey drizzle.",
    menuPrice: 9.75,
    calories: 340,
    ingredientCount: 8,
    deliveryTime: "25m",
    category: "Smoothies & Juices",
    categories: ["Smoothies & Juices", "Bowls"],
    badge: "Antioxidant Rich",
    dietary: ["Organic", "Superfood", "Dairy-Free"],
    image: "/images/acai-superfood-cup.jpg",
    ingredients: [
      { id: "acai", name: "Wild Acai", image: "/images/acai-superfood-cup.jpg", amount: "Pure organic puree" },
      { id: "berries", name: "Blueberries", image: "/images/acai-superfood-cup.jpg", amount: "Antioxidant rich" },
      { id: "chia", name: "Chia Seeds", image: "/images/rainbow-quinoa-bowl.jpg", amount: "Omega-3 crunch" }
    ],
    nutrition: {
      protein: "8g",
      carbs: "54g",
      fiber: "12g",
      fat: "6g"
    }
  },
  {
    id: "rosemary-focaccia",
    name: "Artisan Rosemary & Sea Salt Focaccia",
    shortName: "Rosemary Focaccia",
    tagline: "Free Reward Milestone Perk",
    description: "Naturally fermented sourdough focaccia baked golden with fresh organic rosemary sprigs, extra virgin olive oil, and Maldon flaky sea salt.",
    menuPrice: 5.50,
    calories: 280,
    ingredientCount: 5,
    deliveryTime: "20m",
    category: "Sides & Bakery",
    categories: ["Sides & Bakery", "Featured"],
    badge: "Bakery Fresh Daily",
    dietary: ["Vegetarian", "Natural Sourdough"],
    image: "/images/rosemary-focaccia.jpg",
    ingredients: [
      { id: "sourdough", name: "Wild Sourdough", image: "/images/rosemary-focaccia.jpg", amount: "36hr fermented dough" },
      { id: "rosemary", name: "Fresh Rosemary", image: "/images/hero-spinach.jpg", amount: "Garden aromatic sprigs" },
      { id: "oliveoil", name: "Extra Virgin Olive Oil", image: "/images/green-veggie-bowl.jpg", amount: "Cold pressed first extraction" }
    ],
    nutrition: {
      protein: "7g",
      carbs: "42g",
      fiber: "3g",
      fat: "9g"
    }
  }
];

export const RESTAURANTS = [
  {
    id: "park-meadows",
    name: "Park Meadows",
    shortName: "Park Meadows",
    city: "Lone Tree, CO",
    address: "8423 Park Meadows Center Drive #E160 Lone Tree, CO 80124",
    shortAddress: "Center Drive #E160 Lone Tree, CO 80124",
    hours: "Mon-Sun 10:00am - 8:00pm",
    image: "/images/restaurant-interior-1.jpg",
    rating: 4.9,
    distance: "0.8 mi",
    reviewsCount: 342,
    coordinates: { x: 70, y: 38 },
    amenities: ["Outdoor Patio", "Order Ahead", "Curbside Pickup", "Contactless Pay"]
  },
  {
    id: "millennium-park",
    name: "Millennium Park",
    shortName: "Millennium Park",
    city: "Chicago, IL",
    address: "150 N Michigan Ave Chicago IL 60601",
    shortAddress: "150 N Michigan Ave Chicago IL 60601",
    hours: "Mon-Sun 9:00am - 9:00pm",
    image: "/images/restaurant-interior-2.jpg",
    rating: 4.8,
    distance: "1.4 mi",
    reviewsCount: 512,
    coordinates: { x: 30, y: 55 },
    amenities: ["Spacious Dining", "Express Pick-up", "Cold Brew Bar", "EV Charging"]
  },
  {
    id: "hudson-square",
    name: "Hudson Square",
    shortName: "Hudson Square",
    city: "New York, NY",
    address: "375 Hudson St, New York, NY 10014",
    shortAddress: "375 Hudson St, New York, NY",
    hours: "Mon-Sat 10:30am - 8:30pm",
    image: "/images/restaurant-interior-1.jpg",
    rating: 4.9,
    distance: "2.1 mi",
    reviewsCount: 289,
    coordinates: { x: 45, y: 24 },
    amenities: ["Organic Juice Bar", "Indoor Garden", "Bike Racks"]
  },
  {
    id: "venice-beach",
    name: "Venice Beach Organic Lab",
    shortName: "Venice Beach",
    city: "Los Angeles, CA",
    address: "1428 Abbot Kinney Blvd, Venice, CA 90291",
    shortAddress: "1428 Abbot Kinney Blvd, Venice, CA",
    hours: "Mon-Sun 8:00am - 9:00pm",
    image: "/images/restaurant-interior-3.jpg",
    rating: 4.95,
    distance: "3.2 mi",
    reviewsCount: 618,
    coordinates: { x: 22, y: 72 },
    amenities: ["Sunlit Terrace", "Cold-Pressed Bar", "Dog Friendly", "Surfboard Racks"]
  },
  {
    id: "cherry-creek",
    name: "Cherry Creek Sustainable Kitchen",
    shortName: "Cherry Creek",
    city: "Denver, CO",
    address: "2816 E 3rd Ave, Denver, CO 80206",
    shortAddress: "2816 E 3rd Ave, Denver, CO",
    hours: "Mon-Sun 9:30am - 8:30pm",
    image: "/images/restaurant-interior-4.jpg",
    rating: 4.88,
    distance: "4.5 mi",
    reviewsCount: 420,
    coordinates: { x: 80, y: 48 },
    amenities: ["Velvet Booth Seating", "Organic Wine Bar", "Valet Pickup", "Heated Patio"]
  },
  {
    id: "soho-kitchen",
    name: "SoHo Farm-to-Table Kitchen",
    shortName: "SoHo Kitchen",
    city: "New York, NY",
    address: "472 Broome St, New York, NY 10013",
    shortAddress: "472 Broome St, New York, NY",
    hours: "Mon-Sun 10:00am - 10:00pm",
    image: "/images/restaurant-interior-2.jpg",
    rating: 4.92,
    distance: "5.1 mi",
    reviewsCount: 785,
    coordinates: { x: 58, y: 28 },
    amenities: ["Private Dining Room", "Zero Waste Certified", "Acoustic Seating"]
  }
];

export const GIFT_CARDS = [
  {
    id: "fathers-day",
    title: "GRILLIX HAPPY FATHER'S DAY GIFT CARD",
    category: "Featured",
    headline: "GRILLIX HAPPY FATHER'S DAY",
    subheadline: "GIFT CARD",
    image: "/images/gift-card-fathers-day.jpg",
    badge: "Most Popular",
    options: [25, 50, 75, 100],
    description: "Give the gift of wholesome, handcrafted meals prepared with farm-fresh ingredients."
  },
  {
    id: "spring-ahead",
    title: "GRILLIX SPRING AHEAD GIFT CARD",
    category: "Seasonal",
    headline: "GRILLIX SPRING AHEAD",
    subheadline: "GIFT CARD",
    discountTag: "10% OFF",
    image: "/images/gift-card-spring.jpg",
    badge: "Seasonal Offer",
    options: [20, 40, 60, 100],
    description: "Embrace spring vitality with seasonal salads, fresh grain bowls, and plant-powered fuel."
  },
  {
    id: "wellness-thanks",
    title: "GRILLIX GRATITUDE GIFT CARD",
    category: "Thanks",
    headline: "GRILLIX THANK YOU",
    subheadline: "WELLNESS GIFT",
    discountTag: "BONUS 50 PTS",
    image: "/images/rainbow-quinoa-bowl.jpg",
    badge: "Special Thanks",
    options: [15, 30, 50, 75],
    description: "Show appreciation with healthy nutrition that leaves everyone feeling their best."
  }
];

export const REWARDS_DATA = {
  currentPoints: 3500,
  nextMilestone: 3850,
  nextMilestoneReward: "Free Rosemary Focaccia",
  ptsRemaining: 350,
  drinkMilestone: "A free drink is 200 pts away!",
  specialPromotion: {
    title: "Buy More & Get Rewards",
    description: "Order an entree + get 110 points Limit 1 per customer",
    expiry: "Ends with 05/31",
    image: "/images/rainbow-quinoa-bowl.jpg",
    tag: "Get Details"
  },
  howItWorks: [
    {
      title: "Earn Pts",
      text: "Scan in store or order ahead to get 10 points for every eligible $1 spent*"
    },
    {
      title: "Get more",
      text: "Discover extra ways to earn points with seasonal promotions and partner offers. Keep an eye out for special rewards that make your healthy choices even more rewarding."
    },
    {
      title: "Redeem",
      text: "Turn your points into perks with ease. Whether it's a free signature bowl, a special add-on, or limited-time offers, redeeming is quick and rewarding."
    }
  ]
};

export const INITIAL_CART_ITEMS = [
  {
    item: FOOD_ITEMS[1], // Rainbow Veggie Quinoa Power Bowl
    quantity: 2,
    customizations: "Herbed shredded, extra avocado"
  },
  {
    item: FOOD_ITEMS[4], // Avocado Citrus Salad
    quantity: 1,
    customizations: "Citrus poppy dressing on side"
  }
];

export const REDEEMABLE_PERKS = [
  {
    id: "perk-kombucha",
    title: "Free Cold-Pressed Juice or Kombucha",
    pointsCost: 350,
    category: "Beverage",
    code: "FREEKOMBUCHA",
    image: "/images/green-detox-smoothie.jpg",
    description: "Enjoy any 16oz cold-pressed green juice or wild berry prebiotic kombucha on us."
  },
  {
    id: "perk-focaccia",
    title: "Free Warm Rosemary Focaccia",
    pointsCost: 400,
    category: "Bakery",
    code: "FREEFOCACCIA",
    image: "/images/rosemary-focaccia.jpg",
    description: "Golden olive oil focaccia baked with fresh garden rosemary and flaked sea salt."
  },
  {
    id: "perk-discount-5",
    title: "$5 Off Any Harvest Bowl or Plate",
    pointsCost: 500,
    category: "Discount",
    code: "GRILLIX5OFF",
    image: "/images/green-veggie-bowl.jpg",
    description: "$5.00 immediate discount applied on any scratch-cooked signature bowl or plate."
  },
  {
    id: "perk-avocado",
    title: "Free Organic Hass Avocado Add-on",
    pointsCost: 250,
    category: "Topping",
    code: "FREEAVO",
    image: "/images/herb-bean-sandwich.jpg",
    description: "Add a freshly sliced half Hass avocado to any salad or grain bowl."
  }
];

export const CUSTOM_BOWL_OPTIONS = {
  bases: [
    { id: "wild-rice", name: "Warm Wild Black Rice", cal: 170, protein: 4, carbs: 35, fat: 1, fiber: 3, dietary: ["Vegan", "Gluten-Free"] },
    { id: "quinoa", name: "Tri-Color Herbed Quinoa", cal: 180, protein: 6, carbs: 32, fat: 2, fiber: 4, dietary: ["Vegan", "Gluten-Free", "High Protein"] },
    { id: "spinach", name: "Organic Baby Spinach", cal: 25, protein: 3, carbs: 4, fat: 0, fiber: 3, dietary: ["Vegan", "Gluten-Free", "Organic"] },
    { id: "kale", name: "Massaged Lemon Tuscan Kale", cal: 40, protein: 3, carbs: 6, fat: 1, fiber: 3, dietary: ["Vegan", "Gluten-Free", "Organic"] }
  ],
  veggies: [
    { id: "broccoli", name: "Charred Garlic Broccoli", cal: 55, protein: 4, carbs: 8, fat: 1.5, fiber: 4 },
    { id: "sweet-potato", name: "Roasted Spiced Sweet Potatoes", cal: 90, protein: 2, carbs: 21, fat: 0, fiber: 3 },
    { id: "edamame", name: "Steamed Sweet Edamame & Peas", cal: 75, protein: 6, carbs: 7, fat: 2.5, fiber: 4 },
    { id: "corn", name: "Charred Sweet Corn & Cilantro", cal: 60, protein: 2, carbs: 14, fat: 1, fiber: 2 },
    { id: "tomatoes", name: "Blistered Cherry Tomatoes", cal: 30, protein: 1, carbs: 6, fat: 0, fiber: 2 },
    { id: "cabbage", name: "Pickled Crimson Cabbage", cal: 20, protein: 1, carbs: 4, fat: 0, fiber: 1 }
  ],
  proteins: [
    { id: "chicken", name: "Grilled Herb Free-Range Chicken", cal: 210, protein: 32, carbs: 0, fat: 6, fiber: 0, priceAdd: 0, tag: "Signature" },
    { id: "salmon", name: "Pan-Seared Wild Alaskan Salmon", cal: 240, protein: 28, carbs: 0, fat: 12, fiber: 0, priceAdd: 3.50, tag: "Wild Caught" },
    { id: "tofu", name: "Crispy Tamari Sprouted Organic Tofu", cal: 160, protein: 18, carbs: 5, fat: 8, fiber: 2, priceAdd: 0, tag: "100% Vegan" },
    { id: "steak", name: "Grass-Fed Rosemary Flank Steak", cal: 250, protein: 30, carbs: 0, fat: 11, fiber: 0, priceAdd: 4.00, tag: "Grass-Fed" },
    { id: "egg", name: "Two Pasture-Raised Soft Boiled Eggs", cal: 140, protein: 12, carbs: 1, fat: 10, fiber: 0, priceAdd: 0, tag: "Pasture-Raised" }
  ],
  dressings: [
    { id: "lemon-tahini", name: "Lemon Herb Tahini (House Signature)", cal: 95, fat: 9, dietary: "Vegan, Non-GMO" },
    { id: "green-goddess", name: "Avocado Green Goddess", cal: 80, fat: 8, dietary: "Vegan, Gluten-Free" },
    { id: "spicy-cashew", name: "Spicy Creamy Cashew", cal: 110, fat: 10, dietary: "Vegan, Non-GMO" },
    { id: "balsamic", name: "Aged Balsamic Extra Virgin Olive Oil", cal: 90, fat: 9, dietary: "Vegan, Pure" },
    { id: "lime-vinaigrette", name: "Zesty Lime Cilantro Vinaigrette", cal: 70, fat: 7, dietary: "Vegan, Light" }
  ],
  toppings: [
    { id: "avocado", name: "Fresh Hass Avocado Half", cal: 120, priceAdd: 1.75, tag: "Healthy Fats" },
    { id: "pumpkin-seeds", name: "Toasted Spiced Pumpkin Seeds", cal: 60, priceAdd: 0, tag: "Zinc Rich" },
    { id: "crispy-shallots", name: "Golden Crispy Shallots", cal: 45, priceAdd: 0, tag: "Crunch" },
    { id: "feta", name: "Crumbled Sheep's Milk Feta", cal: 70, priceAdd: 1.00, tag: "Artisan" },
    { id: "sesame", name: "Toasted White & Black Sesame", cal: 35, priceAdd: 0, tag: "Mineral Rich" }
  ]
};

