# CoD Keepers

Keeper decisions for the Chode of Destiny league's Season 2 offseason.

- Every team gets a **private link** that shows only its own roster. Managers mark each player Keep or Cut, see their cap room and draft budget update live, and submit.
- The server checks the cap again on every submission. It refuses a team that's over the $210 cap, and it refuses everyone after the deadline if you set one.
- Managers see which teams have submitted, but not what they picked, until you reveal the picks.
- The **commissioner desk** at `/admin` shows every submission, has a copy button for each team's link, downloads all picks as a CSV, and reveals or hides picks for the whole league.

There's no framework and nothing to install. The site is static pages in `public/`, three Vercel functions in `api/`, and a free Upstash Redis database for the picks.

## Set up on Vercel (about 10 minutes)

1. **Import the repo.** In Vercel, go to **Add New → Project** and import this repo. Leave the Framework Preset on **Other** and don't change any build settings, then click **Deploy**. The first deploy works, but saving picks won't work until you finish the next steps.
2. **Add the database.** In the project, open **Storage → Create Database → Upstash (Redis)**. Choose the free plan and connect it to this project for all environments. Vercel adds the connection settings for you.
3. **Add two settings.** Go to **Settings → Environment Variables** and add:
   | Name | Value |
   |---|---|
   | `ADMIN_PASSWORD` | A password for the commissioner desk. Make it long. |
   | `LINK_SECRET` | Any long random string, such as 40 random letters and numbers. The team link codes are made from it. |
   | `DEADLINE` *(optional)* | When picks lock, for example `2026-10-18T20:00:00-04:00` |
4. **Redeploy.** Go to **Deployments**, open the latest one, choose **⋯ → Redeploy**, and wait until it finishes. Settings only take effect after a redeploy.
5. **Send the links.** Open `https://<your-site>.vercel.app/admin`, enter your password, and use **Copy link** to send each manager his own link privately.

## Good to know

- **Changing `LINK_SECRET` changes every team's link**, and the old links stop working. Saved picks aren't affected. If a link gets shared around, you can change `LINK_SECRET`, redeploy, and send out new links.
- Managers can submit again as many times as they like until the deadline. Each new submission replaces the last one. **Clear** on the desk deletes a team's submission.
- Roster data lives in `lib/teams.js`, pulled from Sleeper. It includes the Season 2 raise (10%, at least $1, rounded up) and cap hits: IR players count at half, rounded up, and taxi players at $0. If rosters change before the deadline, edit that file and push. Vercel redeploys on its own.
- The site tells search engines not to index it, and the repo contains no secrets. The link codes and password live only in Vercel's settings.
