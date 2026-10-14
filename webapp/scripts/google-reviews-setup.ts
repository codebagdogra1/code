// One-time setup for pulling EVERY Google review through the Business Profile
// API (the public Places API stops at five). Run with:
//
//   npx tsx scripts/google-reviews-setup.ts
//
// Before running, in Google Cloud Console (same project as the Places key):
//   1. Request Business Profile API access (approval takes a few days):
//      https://developers.google.com/my-business/content/prereqs
//   2. APIs & Services → Library → enable all three:
//        "Google My Business API", "My Business Account Management API",
//        "My Business Business Information API"
//   3. APIs & Services → OAuth consent screen → External. Add the Google
//      account that owns the Business Profile as a test user, then PUBLISH
//      the app (a "testing" app's refresh tokens expire after 7 days).
//   4. APIs & Services → Credentials → Create credentials → OAuth client ID
//      → type "Desktop app". Copy the client ID and client secret.
//
// The script opens a browser sign-in for the owner account, receives the
// refresh token on a localhost callback, looks up the account and location
// IDs, and prints the env lines to paste into Netlify (and .env).
//
// It needs no npm dependencies beyond Node itself.
import { createServer } from "node:http";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { exec } from "node:child_process";
import { randomBytes } from "node:crypto";

const SCOPE = "https://www.googleapis.com/auth/business.manage";
const PORT = 53682;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;

type Json = Record<string, unknown>;

async function getJson<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const body = await res.text();
  if (!res.ok) throw new Error(`${url} → ${res.status}\n${body}`);
  return JSON.parse(body) as T;
}

function openBrowser(url: string) {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${cmd} "${url}"`, () => {
    /* if this fails the URL is printed anyway */
  });
}

/** Loopback OAuth flow: returns the authorization code Google redirects back with. */
function waitForCode(expectedState: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? "/", REDIRECT_URI);
      if (url.pathname !== "/callback") {
        res.writeHead(404).end();
        return;
      }
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const error = url.searchParams.get("error");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      if (error || !code || state !== expectedState) {
        res.end("<p>Sign-in failed. You can close this tab and re-run the script.</p>");
        server.close();
        reject(new Error(error ?? "No authorization code returned"));
        return;
      }
      res.end("<p>Signed in. You can close this tab and return to the terminal.</p>");
      server.close();
      resolve(code);
    });
    server.on("error", reject);
    server.listen(PORT, "127.0.0.1");
  });
}

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });
  const clientId = (process.env.GOOGLE_BUSINESS_CLIENT_ID ?? (await rl.question("OAuth client ID: "))).trim();
  const clientSecret = (process.env.GOOGLE_BUSINESS_CLIENT_SECRET ?? (await rl.question("OAuth client secret: "))).trim();
  rl.close();
  if (!clientId || !clientSecret) throw new Error("Client ID and secret are required.");

  const state = randomBytes(16).toString("hex");
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent", // forces a refresh token even if previously granted
    state,
  }).toString();

  console.log("\nOpening Google sign-in. Use the account that OWNS the Business Profile.");
  console.log(`If the browser does not open, visit:\n\n${authUrl}\n`);
  const codePromise = waitForCode(state);
  openBrowser(authUrl.toString());
  const code = await codePromise;

  // Exchange the code for tokens.
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: REDIRECT_URI, grant_type: "authorization_code" }),
  });
  const tokens = (await tokenRes.json()) as { access_token?: string; refresh_token?: string; error_description?: string };
  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error(`Token exchange failed: ${tokens.error_description ?? JSON.stringify(tokens)}`);
  }

  // Find the account and location.
  const accounts = await getJson<{ accounts?: { name: string; accountName?: string; type?: string }[] }>(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    tokens.access_token,
  );
  if (!accounts.accounts?.length) throw new Error("This Google account manages no Business Profiles.");

  const found: { account: string; location: string; title: string }[] = [];
  for (const account of accounts.accounts) {
    const accountId = account.name.replace(/^accounts\//, "");
    const locations = await getJson<{ locations?: { name: string; title?: string }[] }>(
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name,title&pageSize=100`,
      tokens.access_token,
    );
    for (const loc of locations.locations ?? []) {
      found.push({ account: accountId, location: loc.name.replace(/^locations\//, ""), title: loc.title ?? "(untitled)" });
    }
  }
  if (found.length === 0) throw new Error("No locations found under this account.");

  console.log("\nLocations this account manages:");
  found.forEach((l, i) => console.log(`  ${i + 1}. ${l.title}  (account ${l.account}, location ${l.location})`));
  const pick = found[0];

  // Prove it works: fetch the first page of reviews.
  const reviews = await getJson<{ totalReviewCount?: number; averageRating?: number; reviews?: Json[] }>(
    `https://mybusiness.googleapis.com/v4/accounts/${pick.account}/locations/${pick.location}/reviews?pageSize=50`,
    tokens.access_token,
  );
  console.log(`\n✓ "${pick.title}": ${reviews.totalReviewCount ?? reviews.reviews?.length ?? 0} reviews, average ${reviews.averageRating ?? "?"}.`);

  console.log("\nAdd these environment variables (Netlify → Site configuration → Environment variables, and .env):\n");
  console.log(`GOOGLE_BUSINESS_CLIENT_ID="${clientId}"`);
  console.log(`GOOGLE_BUSINESS_CLIENT_SECRET="${clientSecret}"`);
  console.log(`GOOGLE_BUSINESS_REFRESH_TOKEN="${tokens.refresh_token}"`);
  console.log(`GOOGLE_BUSINESS_ACCOUNT_ID="${pick.account}"`);
  console.log(`GOOGLE_BUSINESS_LOCATION_ID="${pick.location}"`);
  if (found.length > 1) console.log("\n(First location shown; swap the account/location IDs if another one is the centre.)");
}

main().catch((e) => {
  console.error("\n✗", e instanceof Error ? e.message : e);
  process.exit(1);
});
