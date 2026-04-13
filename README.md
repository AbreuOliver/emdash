# EmDash

A full-stack TypeScript CMS built on [Astro](https://astro.build/) for fast public sites and a modern admin experience. This fork targets Vercel and Node first, with SQLite for local development, Turso/libSQL for production, and a deliberately opinionated no-plugin default for local-business sites.

## Get Started

```bash
npm create emdash@latest
```

Recommended quick-launch path for this fork:

- deploy target: Vercel
- local database: SQLite
- production database: Turso/libSQL
- plugins: none by default

See `docs/VERCEL.md` for the production deployment path.

Cloudflare support still exists in the upstream architecture, but it is no longer the primary path for this fork.

## Templates

EmDash ships with three starter templates:

<table>
<tr>
<td width="33%" valign="top">

### Blog

<a href="assets/templates/blog/latest/"><img src="assets/templates/blog/latest/homepage-light-desktop.jpg" alt="Blog template" width="100%"></a>

A classic blog with sidebar widgets, search, and RSS.

- Categories & tags
- Full-text search
- Comment-ready
- RSS feed
- Dark / light mode

</td>
<td width="33%" valign="top">

### Marketing

<a href="assets/templates/marketing/latest/"><img src="assets/templates/marketing/latest/homepage-light-desktop.jpg" alt="Marketing template" width="100%"></a>

A conversion-focused landing page with pricing and contact form.

- Hero with CTAs
- Feature grid
- Pricing cards
- FAQ and contact form
- Dark / light mode

</td>
<td width="33%" valign="top">

### Portfolio

<a href="assets/templates/portfolio/latest/"><img src="assets/templates/portfolio/latest/work-light-desktop.jpg" alt="Portfolio template" width="100%"></a>

A visual portfolio for showcasing creative work.

- Project grid
- Tag filtering
- Case study pages
- RSS feed
- Dark / light mode
<br /><br />
</td>
</tr>
</table>

## Why EmDash?

**WordPress was built for a different era.** Running WordPress today means managing PHP alongside JavaScript, layering caches to get acceptable performance, and knowing that [96% of WordPress security vulnerabilities come from plugins](https://patchstack.com/whitepaper/state-of-wordpress-security-in-2024/). EmDash is what WordPress would look like if you started from scratch with today's tools.

**Opinionated, built-in core.** Instead of depending on a wide plugin marketplace, this fork is aimed at built-in CMS features for local-business sites: editing pages, posts, media, menus, and settings with as little operational complexity as possible.

```typescript
export default () =>
	definePlugin({
		id: "notify-on-publish",
		capabilities: ["read:content", "email:send"],
		hooks: {
			"content:afterSave": async (event, ctx) => {
				if (event.content.status !== "published") return;
				await ctx.email.send({
					to: "editors@example.com",
					subject: `New post: ${event.content.title}`,
				});
			},
		},
	});
```

**Structured content, not serialized HTML.** WordPress stores rich text as HTML with metadata embedded in comments -- tying your content to its DOM representation. EmDash uses [Portable Text](https://www.portabletext.org/), a structured JSON format that decouples content from presentation. Your content can render as a web page, a mobile app, an email, or an API response without parsing HTML.

**Built for agents.** EmDash ships with agent skills for building plugins and themes, a CLI that lets agents manage content and schema programmatically, and a built-in [MCP server](https://modelcontextprotocol.io/) so AI tools like Claude and ChatGPT can interact with your site directly.

**Runs where you need it.** EmDash uses portable abstractions at every layer -- Kysely for SQL, S3 API for storage -- that work with SQLite, Turso, PostgreSQL, AWS S3, local files, and Cloudflare services. This fork treats Vercel and plain Node as the default deployment path.

## How It Works

EmDash is an Astro integration. Add it to your config and you get a complete CMS: admin panel, REST API, authentication, media library, and plugin system.

```typescript
// astro.config.mjs
import emdash from "emdash/astro";
import { d1 } from "emdash/db";

export default defineConfig({
	integrations: [emdash({ database: d1() })],
});
```

Content types are defined in the database, not in code. Non-developers create and modify collections through the admin UI. Each collection gets a real SQL table with typed columns. Developers generate TypeScript types from the live schema:

```bash
npx emdash types
```

Query content using Astro's Live Collections -- no rebuilds, no separate API:

```astro
---
import { getEmDashCollection } from "emdash";
const { entries: posts } = await getEmDashCollection("posts");
---

{posts.map((post) => <article>{post.data.title}</article>)}
```

## Features

**Content** -- Blog posts, pages, custom content types. Rich text editing via TipTap with Portable Text storage. Revisions, drafts, scheduled publishing, full-text search (FTS5), inline visual editing.

**Admin** -- Full admin panel with visual schema builder, media library (drag-drop uploads via signed URLs), navigation menus, taxonomies, widgets, and a WordPress import wizard.

**Auth** -- Passkey-first (WebAuthn) with OAuth and magic link fallbacks. Role-based access control: Administrator, Editor, Author, Contributor.

**Plugins** -- Plugin APIs still exist in the codebase, but this fork does not treat plugins or the marketplace as the primary product story. The default recommendation is a no-plugin deployment with built-in features and reviewed first-party code.

**Agents** -- Skill files for AI-assisted plugin and theme development. CLI for programmatic site management. Built-in MCP server for direct AI tool integration.

**WordPress migration** -- Import posts, pages, media, and taxonomies from WXR exports, the WordPress REST API, or WordPress.com. Agent skills help port plugins and themes.

## Portable Platforms

| Layer    | Cloudflare                  | Also works with                                     |
| -------- | --------------------------- | --------------------------------------------------- |
| Database | D1                          | SQLite, Turso/libSQL, PostgreSQL                    |
| Storage  | R2                          | AWS S3, any S3-compatible service, local filesystem |
| Sessions | KV                          | Redis, file-based                                   |
| Plugins  | Worker isolates (sandboxed) | In-process (safe mode)                              |

## Status

EmDash is in **beta preview**. We welcome contributions, feedback, plugins, themes, and ideas.

```bash
npm create emdash@latest
```

See the [documentation](https://github.com/emdash-cms/emdash/tree/main/docs) for guides, API reference, and plugin development.

## Development

This is a pnpm monorepo. To contribute:

```bash
git clone https://github.com/emdash-cms/emdash.git && cd emdash
pnpm install
pnpm build
```

Run the demo (Node.js + SQLite, no Cloudflare account needed):

For Vercel production, keep SQLite locally and switch to Turso/libSQL in production. See `docs/VERCEL.md`.

```bash
pnpm --filter emdash-demo seed
pnpm --filter emdash-demo dev
```

Open the admin at [http://localhost:4321/\_emdash/admin](http://localhost:4321/_emdash/admin).

```bash
pnpm test          # run all tests
pnpm typecheck     # type check
pnpm lint:quick    # fast lint (< 1s)
pnpm format        # format with oxfmt
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contributor guide.

## Repository Structure

```
packages/
  core/           Astro integration, APIs, admin UI, CLI
  auth/           Authentication library
  blocks/         Portable Text block definitions
  cloudflare/     Cloudflare adapter (D1, R2, Worker Loader)
  plugins/        First-party plugins (forms, embeds, SEO, audit-log, etc.)
  create-emdash/  npm create emdash scaffolding
  gutenberg-to-portable-text/  WordPress block converter

templates/        Starter templates (blog, marketing, portfolio, starter, blank)
demos/            Development and example sites
docs/             Documentation site (Starlight)
```
