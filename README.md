# CoD Keepers

The Chode of Destiny league's private team site: keeper decisions for the Season 2 offseason (done), now Season 2 roster moves after the auction.

- Every team gets a **private link** that shows only its own roster. Managers mark each player Keep, Taxi or Cut, see their cap room and draft budget update live, and submit.
- **Taxi squad:** up to 4 players per team, limited to players in their first two NBA seasons (`taxiOk` in `lib/teams.js`; Collier and González are grandfathered). A taxi player gets no raise and counts $0 against the cap. Marking a current taxi player Keep calls him up. The charter's 2-season limit and the rule against returning to taxi after a call-up aren't tracked by the site, so check those yourself.
- **Buy-in and luxury tax (adopted):** teams can submit up to the $230 hard cap. The team page shows a live buy-in tracker: $50 at a $210 payroll, $0.25 off per $1 under, +$0.50 per $1 from $210 to $220, +$1 per $1 from $220 to $230. The desk shows each team's buy-in and the pot so far. Rules live in `BUY_IN` in `lib/league.js`.
- **What-if statuses:** managers can preview an injured player on IR or active. This is only for planning. Submissions use official statuses.
- The server checks the cap again on every submission. It refuses a team that's over the $230 hard cap or doesn't leave $1 per open roster spot, and it refuses everyone after the deadline if you set one.
- Managers see which teams have submitted, but not what they picked, until you reveal the picks.
- The **commissioner desk** at `/admin` shows every submission, has a copy button for each team's link, downloads all picks as a CSV, and reveals or hides picks for the whole league.

There's no framework and nothing to install. The site is static pages in `public/`, three Vercel functions in `api/`, and a free Upstash Redis database for the picks.

## Season 2 roster moves (after the Oct 18 auction)

Keeper decisions are finished, so each team's private link (`/t/<code>`) now opens that team's Season 2 roster instead. The manager marks each player Active, IR, Taxi or Cut, watches payroll, buy-in and compliance update, and submits. Only that team's link can change its moves.

- **The server checks every submission** (`evaluateMoves` in `lib/league.js`) and refuses any that leave the roster out of compliance: more than 15 active, 3 IR or 4 taxi, over the $230 hard cap, or an IR player Sleeper doesn't list as Out. Taxi eligibility follows Sleeper (league rule, Oct 20): if Sleeper allows a player on taxi, the site does too. Submissions are saved as `moves:<team>` in the database.
- **Submitting doesn't change Sleeper.** The commissioner desk at `/admin` lists each team's submitted moves, payroll before and after, and buy-in, and downloads them all as a CSV. Make the moves in Sleeper, or check that managers did.
- **`/rosters`** is a public, read-only league board: every team's roster by Sleeper slot, salaries, cap hits and compliance, plus which teams have submitted moves. It has no links and no planning.
- Roster data is in `lib/rosters.js`, a snapshot of Sleeper from Oct 20, 2026. After teams make their moves in Sleeper, regenerate that file and push.
- Optional `MOVES_DEADLINE` environment variable (for example `2026-10-22T20:00:00-04:00`) locks roster-move submissions. The old `DEADLINE` only applied to keeper picks.
- **Keeper picks archive:** the keeper submissions (`sub:<team>`) and `lib/teams.js` are kept. Download them from the desk with "Keeper picks archive (CSV)".

## Trade machine

`/trades` lets anyone build a trade between two teams and check it against both teams' cap numbers. It's public and read-only.

- A team's **cap number** is the most payroll it can carry in-season: the $210 cap, or its payroll at the start of the season if that was higher. A trade must leave both teams at or under their cap numbers.
- **FAAB** is a team's room under its cap number. Trading FAAB moves cap room: the sender's cap number drops by that amount and the receiver's rises by it. No cap number can go over the $230 hard cap.
- Rosters come from `lib/rosters.js`, plus any roster moves a team submitted after that snapshot (`SNAPSHOT_AT`); older submissions are already in Sleeper and aren't applied twice. The rules live in `capNumber` and `evaluateTradeSide` in `lib/league.js`, and the page mirrors them for live feedback.
- **Set the season-start payrolls** in `lib/caps.js` (`START_PAYROLL`) once rosters are final. Until then, cap numbers use each team's current payroll. **Record FAAB from completed trades** in `FAAB_TRADED` there, then push.
- The machine only checks the cap. It doesn't make trades or move FAAB; the commissioner approves and records them.

The setup below is unchanged.

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
