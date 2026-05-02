CREATE TABLE banners (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id),
  text TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  variant TEXT NOT NULL DEFAULT 'info' CHECK(variant IN ('info', 'warning', 'success')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
