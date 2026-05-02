CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  published_at TEXT,
  body TEXT DEFAULT '',
  image_id TEXT REFERENCES images(id),
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  seo_keywords TEXT DEFAULT '',
  seo_no_index INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(site_id, slug)
);
