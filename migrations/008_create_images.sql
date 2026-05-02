CREATE TABLE images (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id),
  imagekit_file_id TEXT NOT NULL,
  imagekit_url TEXT NOT NULL,
  original_filename TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
