import vercel from "@astrojs/vercel/serverless";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { libsql, sqlite } from "emdash/db";
import { local, s3 } from "emdash/astro";

const isProduction = process.env.NODE_ENV === "production";
const useRemoteDb = !!process.env.TURSO_DATABASE_URL;
const useRemoteStorage = !!process.env.S3_BUCKET;

export default defineConfig({
	output: "server",
	adapter: vercel(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: useRemoteDb
				? libsql({
						url: process.env.TURSO_DATABASE_URL!,
						authToken: process.env.TURSO_AUTH_TOKEN,
					})
				: sqlite({ url: "file:./data.db" }),
			storage: useRemoteStorage
				? s3({
						endpoint: process.env.S3_ENDPOINT,
						bucket: process.env.S3_BUCKET!,
						region: process.env.S3_REGION,
						accessKeyId: process.env.S3_ACCESS_KEY_ID,
						secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
						publicUrl: process.env.S3_PUBLIC_URL,
					})
				: local({
						directory: "./uploads",
						baseUrl: "/_emdash/api/media/file",
					}),
			plugins: [],
			marketplace: false,
			// Keep quick-launch sites simple. Local uses SQLite + filesystem.
			// Production on Vercel should set TURSO_* and S3_* env vars.
		}),
	],
	devToolbar: { enabled: false },
	vite: {
		define: {
			"import.meta.env.PUBLIC_EMDASH_DEPLOY_TARGET": JSON.stringify(
				isProduction ? "vercel" : "local",
			),
		},
	},
});
