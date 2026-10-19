// In-season cap numbers (league rule, Oct 19, 2026).
// A team's cap number is the most payroll it can carry during the season: the $210 cap,
// or its payroll at the start of the season if that was higher. A trade must leave both
// teams at or under their cap numbers, unless FAAB is traded to cover the difference:
// FAAB sent lowers the sender's cap number and raises the receiver's by the same amount.
// No cap number can go above the $230 league hard cap.
//
// START_PAYROLL: each team's payroll at the start of the season. Until a team is listed here,
// the site uses its current payroll (its submitted roster moves if any, otherwise Sleeper).
// Fill this in once rosters are final, then push. Keys are the team keys in lib/rosters.js.
export const START_PAYROLL = {
  // babyjokic: 230,
};

// FAAB_TRADED: net FAAB each team has received (+) or sent (-) in completed trades.
// Example: suckitmitch sends babyjokic $5 -> { babyjokic: 5, suckitmitch: -5 }.
export const FAAB_TRADED = {
};
