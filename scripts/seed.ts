import { getDb } from '../src/lib/server/db';
import { v7 as uuidv7 } from 'uuid';
import {
  upsertSettings,
  upsertHours,
  createPost,
  createPage,
  createBanner,
} from '../src/lib/server/queries';

const defaultWeeklyHours = [
  { label: 'Monday', opens: '09:00', closes: '17:00', closed: false },
  { label: 'Tuesday', opens: '09:00', closes: '17:00', closed: false },
  { label: 'Wednesday', opens: '09:00', closes: '17:00', closed: false },
  { label: 'Thursday', opens: '09:00', closes: '17:00', closed: false },
  { label: 'Friday', opens: '09:00', closes: '17:00', closed: false },
  { label: 'Saturday', opens: '10:00', closes: '15:00', closed: false },
  { label: 'Sunday', opens: '', closes: '', closed: true },
  { label: 'Christmas', opens: '', closes: '', closed: true },
];

async function seed() {
  const db = getDb();
  const siteId = uuidv7();
  const apiKey = `sk_${uuidv7().replace(/-/g, '').slice(0, 32)}`;

  console.log('Creating site...');
  await db.execute({
    sql: 'INSERT INTO sites (id, api_key, name, template) VALUES (?, ?, ?, ?)',
    args: [siteId, apiKey, 'Sample Business', 'default'],
  });

  console.log('Creating settings...');
  await upsertSettings(siteId, {
    title: 'Sample Business',
    tagline: 'Your trusted local service provider',
    phone: '(555) 123-4567',
    email: 'hello@samplebusiness.com',
    address: '123 Main Street, Your Town, ST 00000',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
  }, 'published');

  console.log('Creating hours...');
  await upsertHours(
    siteId,
    defaultWeeklyHours.map((h, i) => ({
      ...h,
      sortOrder: i,
    })),
    'published'
  );

  console.log('Creating welcome post...');
  await createPost(siteId, {
    slug: 'welcome',
    title: 'Welcome to Our New Website',
    excerpt: 'We are excited to launch our new online presence.',
    publishedAt: new Date().toISOString().split('T')[0],
    body: 'This is your first post. Edit it from the admin panel to share updates, announcements, or news with your customers.',
    seoTitle: 'Welcome to Our New Website',
    seoDescription: 'We are excited to launch our new online presence.',
    seoKeywords: 'local business, welcome',
    seoNoIndex: false,
  });

  console.log('Creating contact page...');
  await createPage(siteId, {
    slug: 'contact',
    title: 'Contact Us',
    body: '## Get in Touch\n\nWe would love to hear from you. Call us at (555) 123-4567 or visit us at 123 Main Street.\n\n## Hours\n\nSee our business hours on the home page.',
    seoTitle: 'Contact Us',
    seoDescription: 'Get in touch with us.',
    seoKeywords: 'contact, phone, address',
    seoNoIndex: false,
  });

  console.log('Publishing draft content...');
  await db.execute({
    sql: "UPDATE posts SET status = 'published' WHERE site_id = ? AND status = 'draft'",
    args: [siteId],
  });
  await db.execute({
    sql: "UPDATE pages SET status = 'published' WHERE site_id = ? AND status = 'draft'",
    args: [siteId],
  });

  console.log('\n✅ Seed complete!');
  console.log(`Site ID: ${siteId}`);
  console.log(`API Key: ${apiKey}`);
  console.log('\nSave this API key — you will need it to access the admin.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
