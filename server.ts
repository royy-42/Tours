import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("tours.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    price INTEGER NOT NULL,
    duration TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    rating REAL DEFAULT 4.5,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_id INTEGER,
    customer_name TEXT,
    customer_email TEXT,
    booking_date TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(tour_id) REFERENCES tours(id)
  );

  CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hero_image TEXT,
    video_url TEXT,
    description TEXT,
    highlights TEXT, -- JSON string
    attractions TEXT -- JSON string
  );
`);

// Seed data if empty
const tourCount = db.prepare("SELECT count(*) as count FROM tours").get() as { count: number };
if (tourCount.count === 0) {
  const insert = db.prepare("INSERT INTO tours (title, location, price, duration, description, image_url, rating, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  
  const seedTours = [
    ["Golden Triangle Heritage", "Delhi, Agra, Jaipur", 45000, "6 Days", "Explore the rich history and architectural marvels of North India.", "https://picsum.photos/seed/tajmahal/800/600", 4.9, "Heritage"],
    ["Kerala Backwaters Retreat", "Alleppey, Munnar", 32000, "5 Days", "Relax in the serene houseboats and lush tea gardens of God's Own Country.", "https://picsum.photos/seed/kerala/800/600", 4.8, "Nature"],
    ["Royal Rajasthan Odyssey", "Jodhpur, Udaipur", 55000, "8 Days", "Experience the grandeur of palaces and the vibrant culture of the desert state.", "https://picsum.photos/seed/rajasthan/800/600", 4.7, "Luxury"],
    ["Himalayan Adventure", "Manali, Leh", 38000, "7 Days", "Thrilling mountain passes and breathtaking views of the Himalayas.", "https://picsum.photos/seed/himalayas/800/600", 4.9, "Adventure"],
    ["Goa Beach Escape", "North & South Goa", 25000, "4 Days", "Sun, sand, and the best beach parties in India.", "https://picsum.photos/seed/goa/800/600", 4.6, "Beach"],
    ["Varanasi Spiritual Journey", "Varanasi", 18000, "3 Days", "A deep dive into the spiritual heart of India along the Ganges.", "https://picsum.photos/seed/varanasi/800/600", 4.8, "Spiritual"]
  ];

  for (const tour of seedTours) {
    insert.run(...tour);
  }
}

const destCount = db.prepare("SELECT count(*) as count FROM destinations").get() as { count: number };
if (destCount.count === 0) {
  const insert = db.prepare("INSERT INTO destinations (slug, name, hero_image, video_url, description, highlights, attractions) VALUES (?, ?, ?, ?, ?, ?, ?)");
  
  const seedDestinations = [
    [
      "goa", 
      "Goa", 
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=2000",
      "https://www.youtube.com/embed/P7OQ97_S_28", // Placeholder video
      "India's pocket-sized paradise, Goa is a kaleidoscopic blend of Portuguese-Indian heritage, sun-drenched beaches, and vibrant nightlife.",
      JSON.stringify(["Pristine Beaches", "Portuguese Architecture", "Spicy Seafood", "Night Markets"]),
      JSON.stringify([
        { name: "Baga Beach", desc: "Famous for its nightlife and water sports." },
        { name: "Basilica of Bom Jesus", desc: "A UNESCO World Heritage site." },
        { name: "Dudhsagar Falls", desc: "A majestic four-tiered waterfall." }
      ])
    ],
    [
      "rajasthan", 
      "Rajasthan", 
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=2000",
      "https://www.youtube.com/embed/K_T8_n8_8_8",
      "The Land of Kings, Rajasthan is a tapestry of majestic forts, opulent palaces, and the golden sands of the Thar Desert.",
      JSON.stringify(["Royal Palaces", "Desert Safaris", "Folk Music", "Handicrafts"]),
      JSON.stringify([
        { name: "Amer Fort", desc: "A stunning hilltop fort in Jaipur." },
        { name: "City Palace, Udaipur", desc: "A complex of palaces on Lake Pichola." },
        { name: "Mehrangarh Fort", desc: "One of the largest forts in India, Jodhpur." }
      ])
    ],
    [
      "kerala", 
      "Kerala", 
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=2000",
      "https://www.youtube.com/embed/R83BlU5nn68",
      "God's Own Country, Kerala is a tropical symphony of swaying palms, emerald backwaters, and rejuvenating Ayurveda.",
      JSON.stringify(["Backwater Cruises", "Tea Plantations", "Kathakali Dance", "Ayurvedic Spas"]),
      JSON.stringify([
        { name: "Alleppey Backwaters", desc: "The Venice of the East." },
        { name: "Munnar Tea Gardens", desc: "Lush green hills and valleys." },
        { name: "Varkala Beach", desc: "Dramatic cliffs overlooking the Arabian Sea." }
      ])
    ]
  ];

  for (const dest of seedDestinations) {
    insert.run(...dest);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/tours", (req, res) => {
    const tours = db.prepare("SELECT * FROM tours").all();
    res.json(tours);
  });

  app.get("/api/destinations", (req, res) => {
    const destinations = db.prepare("SELECT * FROM destinations").all();
    res.json(destinations.map(d => ({
      ...d,
      highlights: JSON.parse(d.highlights),
      attractions: JSON.parse(d.attractions)
    })));
  });

  app.get("/api/destinations/:slug", (req, res) => {
    const dest = db.prepare("SELECT * FROM destinations WHERE slug = ?").get(req.params.slug) as any;
    if (dest) {
      res.json({
        ...dest,
        highlights: JSON.parse(dest.highlights),
        attractions: JSON.parse(dest.attractions)
      });
    } else {
      res.status(404).json({ error: "Destination not found" });
    }
  });

  app.get("/api/tours/:id", (req, res) => {
    const tour = db.prepare("SELECT * FROM tours WHERE id = ?").get(req.params.id);
    if (tour) {
      res.json(tour);
    } else {
      res.status(404).json({ error: "Tour not found" });
    }
  });

  app.post("/api/bookings", (req, res) => {
    const { tour_id, customer_name, customer_email } = req.body;
    const info = db.prepare("INSERT INTO bookings (tour_id, customer_name, customer_email, booking_date) VALUES (?, ?, ?, ?)")
      .run(tour_id, customer_name, customer_email, new Date().toISOString());
    res.json({ success: true, bookingId: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
