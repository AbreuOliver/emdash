CREATE TABLE business_hours (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id),
  label TEXT NOT NULL,
  opens TEXT DEFAULT '',
  closes TEXT DEFAULT '',
  closed INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
