CREATE TABLE events (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  start_datetime TEXT NOT NULL,
  end_datetime TEXT,
  location TEXT DEFAULT '',
  image_id TEXT REFERENCES images(id),
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  seo_keywords TEXT DEFAULT '',
  seo_no_index INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
