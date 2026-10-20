// Season 2 rosters after the Oct 18, 2026 free agent auction, pulled from Sleeper on Oct 20, 2026.
// status: where Sleeper has the player now (active, ir, taxi). slot: his Sleeper starting slot, if any.
// s1: Season 1 salary (2025 auction price or FAAB bid; null for players won in the Oct 18 auction).
// s2: Season 2 salary. Kept players got the 2nd-season raise (10%, at least $1, rounded up);
//     taxi players kept their Season 1 salary; auction players cost their winning bid.
// src: "kept", "kept-taxi", "auction" or "faab" (signed in-season; salary = winning bid).
// Taxi eligibility follows Sleeper (league rule, Oct 20, 2026): if Sleeper allows a player on taxi, he can be there.
// ir: "out" if Sleeper listed him Out on Oct 20, "not" if he wasn't (irNote says why), "unknown" if not checked.
// To refresh after roster moves, regenerate this file from Sleeper and push.
export const AS_OF = "2026-10-20";
// Moves submitted before this time are already reflected in this snapshot, so they aren't applied again.
export const SNAPSHOT_AT = "2026-10-20T19:30:00-04:00";
export default [
 {
  "key": "babyjokic",
  "team": "Baby Jokic",
  "manager": "lucaferrari9",
  "emptyStarters": 0,
  "players": [
   {
    "id": "1257",
    "name": "Al Horford",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1583",
    "name": "Jusuf Nurkić",
    "status": "ir",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "out"
   },
   {
    "id": "1845",
    "name": "Donovan Mitchell",
    "status": "active",
    "slot": "PG",
    "s1": 41,
    "s2": 46,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1846",
    "name": "Bam Adebayo",
    "status": "active",
    "slot": "C",
    "s1": 25,
    "s2": 28,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2001",
    "name": "RJ Barrett",
    "status": "active",
    "slot": "SF",
    "s1": 3,
    "s2": 4,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2009",
    "name": "Kevin Porter",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2050",
    "name": "De'Andre Hunter",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2316",
    "name": "Austin Reaves",
    "status": "active",
    "slot": "SG",
    "s1": 15,
    "s2": 17,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2422",
    "name": "Collin Gillespie",
    "status": "active",
    "slot": "UTIL",
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2457",
    "name": "Christian Braun",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2458",
    "name": "Paolo Banchero",
    "status": "active",
    "slot": "PF",
    "s1": 62,
    "s2": 69,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2474",
    "name": "Moussa Diabaté",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2718",
    "name": "Zach Edey",
    "status": "active",
    "slot": "UTIL",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2766",
    "name": "Kyle Filipowski",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "4747",
    "name": "Joan Beringer",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4751",
    "name": "Derik Queen",
    "status": "active",
    "slot": "UTIL",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "4761",
    "name": "Khaman Maluach",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4764",
    "name": "Nique Clifford",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "4863",
    "name": "Dailyn Swain",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   }
  ]
 },
 {
  "key": "chettywap",
  "team": "Chetty Wap",
  "manager": "jtrumps35",
  "emptyStarters": 0,
  "players": [
   {
    "id": "1433",
    "name": "Kevin Durant",
    "status": "active",
    "slot": "SF",
    "s1": 32,
    "s2": 36,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1444",
    "name": "Damian Lillard",
    "status": "active",
    "slot": "PG",
    "s1": null,
    "s2": 3,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "1739",
    "name": "Domantas Sabonis",
    "status": "active",
    "slot": "PF",
    "s1": null,
    "s2": 20,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "1967",
    "name": "Jalen Brunson",
    "status": "active",
    "slot": "UTIL",
    "s1": null,
    "s2": 16,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2161",
    "name": "Tyrese Haliburton",
    "status": "active",
    "slot": "SG",
    "s1": null,
    "s2": 48,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2438",
    "name": "Jalen Duren",
    "status": "active",
    "slot": "UTIL",
    "s1": 4,
    "s2": 5,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2441",
    "name": "Walker Kessler",
    "status": "active",
    "slot": "C",
    "s1": null,
    "s2": 3,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2455",
    "name": "Chet Holmgren",
    "status": "active",
    "slot": "UTIL",
    "s1": 33,
    "s2": 37,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2566",
    "name": "Ausar Thompson",
    "status": "active",
    "slot": null,
    "s1": 3,
    "s2": 4,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2726",
    "name": "Kel'el Ware",
    "status": "active",
    "slot": null,
    "s1": 2,
    "s2": 3,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "4738",
    "name": "Tre Johnson",
    "status": "taxi",
    "slot": null,
    "s1": 2,
    "s2": 2,
    "src": "kept-taxi",
    "ir": "unknown"
   },
   {
    "id": "4740",
    "name": "Kon Knueppel",
    "status": "active",
    "slot": null,
    "s1": 3,
    "s2": 4,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "4744",
    "name": "Egor Dëmin",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "faab",
    "ir": "unknown"
   },
   {
    "id": "4754",
    "name": "Dylan Harper",
    "status": "active",
    "slot": null,
    "s1": 15,
    "s2": 17,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "4755",
    "name": "Collin Murray-Boyles",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 6,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4862",
    "name": "Caleb Wilson",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 16,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4876",
    "name": "Kingston Flemings",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 3,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4880",
    "name": "Allen Graves",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4883",
    "name": "Brayden Burries",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 6,
    "src": "auction",
    "ir": "unknown"
   }
  ]
 },
 {
  "key": "chodejugglers",
  "team": "Chode Jugglers",
  "manager": "bcoon55",
  "emptyStarters": 0,
  "players": [
   {
    "id": "1380",
    "name": "Giannis Antetokounmpo",
    "status": "active",
    "slot": "PF",
    "s1": 71,
    "s2": 79,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1718",
    "name": "Jakob Poeltl",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1913",
    "name": "Miles Bridges",
    "status": "active",
    "slot": "UTIL",
    "s1": 3,
    "s2": 4,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1934",
    "name": "Isaiah Hartenstein",
    "status": "active",
    "slot": "UTIL",
    "s1": null,
    "s2": 2,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "1988",
    "name": "Michael Porter",
    "status": "active",
    "slot": "UTIL",
    "s1": 4,
    "s2": 5,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1998",
    "name": "Coby White",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 2,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2568",
    "name": "Brandon Miller",
    "status": "active",
    "slot": "SG",
    "s1": 6,
    "s2": 7,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2574",
    "name": "Amen Thompson",
    "status": "active",
    "slot": "PG",
    "s1": 58,
    "s2": 64,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2586",
    "name": "Cason Wallace",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2712",
    "name": "Jaylon Tyson",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 2,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2714",
    "name": "Kyshawn George",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2733",
    "name": "Alex Sarr",
    "status": "active",
    "slot": "C",
    "s1": 2,
    "s2": 3,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2772",
    "name": "Ajay Mitchell",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 3,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4866",
    "name": "AJ Dybantsa",
    "status": "active",
    "slot": "SF",
    "s1": null,
    "s2": 23,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4867",
    "name": "Ebuka Okorie",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4881",
    "name": "Keaton Wagler",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 9,
    "src": "auction",
    "ir": "unknown"
   }
  ]
 },
 {
  "key": "itsyaboygento",
  "team": "ItsyaboyGento",
  "manager": "lorenzoxv9",
  "emptyStarters": 0,
  "players": [
   {
    "id": "1054",
    "name": "Kyrie Irving",
    "status": "active",
    "slot": "UTIL",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1595",
    "name": "Myles Turner",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "1717",
    "name": "Fred VanVleet",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 2,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "1792",
    "name": "Dillon Brooks",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1872",
    "name": "De'Aaron Fox",
    "status": "active",
    "slot": "UTIL",
    "s1": null,
    "s2": 2,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "1957",
    "name": "Shai Gilgeous-Alexander",
    "status": "active",
    "slot": "UTIL",
    "s1": null,
    "s2": 78,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "1970",
    "name": "Luka Dončić",
    "status": "active",
    "slot": "PG",
    "s1": null,
    "s2": 81,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2032",
    "name": "Nic Claxton",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2055",
    "name": "Nickeil Alexander-Walker",
    "status": "active",
    "slot": "SG",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2275",
    "name": "Day'Ron Sharpe",
    "status": "active",
    "slot": "C",
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2308",
    "name": "Alperen Şengün",
    "status": "active",
    "slot": "PF",
    "s1": null,
    "s2": 32,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2613",
    "name": "Toumani Camara",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2835",
    "name": "Matas Buzelis",
    "status": "active",
    "slot": "SF",
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4864",
    "name": "Yaxel Lendeborg",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 11,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4871",
    "name": "Mikel Brown",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 3,
    "src": "auction",
    "ir": "unknown"
   }
  ]
 },
 {
  "key": "lefantasy",
  "team": "LeFantasy",
  "manager": "RyRob12",
  "emptyStarters": 0,
  "players": [
   {
    "id": "1321",
    "name": "DeMar DeRozan",
    "status": "active",
    "slot": null,
    "s1": 5,
    "s2": 6,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1526",
    "name": "Zach LaVine",
    "status": "active",
    "slot": null,
    "s1": 3,
    "s2": 4,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1747",
    "name": "Jamal Murray",
    "status": "active",
    "slot": "UTIL",
    "s1": 4,
    "s2": 5,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1752",
    "name": "Lauri Markkanen",
    "status": "active",
    "slot": "UTIL",
    "s1": 7,
    "s2": 8,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1803",
    "name": "Josh Hart",
    "status": "active",
    "slot": "SG",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1924",
    "name": "Jaren Jackson",
    "status": "active",
    "slot": "C",
    "s1": 15,
    "s2": 17,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1974",
    "name": "Deandre Ayton",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2007",
    "name": "Darius Garland",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2036",
    "name": "Naz Reid",
    "status": "active",
    "slot": null,
    "s1": 3,
    "s2": 4,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2054",
    "name": "Zion Williamson",
    "status": "active",
    "slot": "UTIL",
    "s1": 18,
    "s2": 20,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2135",
    "name": "Jaden McDaniels",
    "status": "active",
    "slot": null,
    "s1": 4,
    "s2": 5,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2259",
    "name": "Evan Mobley",
    "status": "active",
    "slot": "PF",
    "s1": 38,
    "s2": 42,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2267",
    "name": "Cade Cunningham",
    "status": "active",
    "slot": "PG",
    "s1": 70,
    "s2": 77,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2304",
    "name": "Franz Wagner",
    "status": "active",
    "slot": "SF",
    "s1": 24,
    "s2": 27,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2461",
    "name": "Andrew Nembhard",
    "status": "active",
    "slot": null,
    "s1": 3,
    "s2": 4,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "4750",
    "name": "Jeremiah Fears",
    "status": "taxi",
    "slot": null,
    "s1": 2,
    "s2": 2,
    "src": "kept-taxi",
    "ir": "unknown"
   },
   {
    "id": "4753",
    "name": "Carter Bryant",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4759",
    "name": "Kasparas Jakučionis",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4868",
    "name": "Christian Anderson",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   }
  ]
 },
 {
  "key": "nandomags",
  "team": "nandomags",
  "manager": "nandomags",
  "emptyStarters": 0,
  "players": [
   {
    "id": "1000",
    "name": "Jimmy Butler",
    "status": "active",
    "slot": null,
    "s1": 5,
    "s2": 6,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1074",
    "name": "Paul George",
    "status": "active",
    "slot": "UTIL",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1240",
    "name": "James Harden",
    "status": "active",
    "slot": "UTIL",
    "s1": 34,
    "s2": 38,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1308",
    "name": "Kawhi Leonard",
    "status": "active",
    "slot": "SF",
    "s1": 12,
    "s2": 14,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1362",
    "name": "LeBron James",
    "status": "active",
    "slot": "PF",
    "s1": 32,
    "s2": 36,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1950",
    "name": "Robert Williams",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2040",
    "name": "Ja Morant",
    "status": "active",
    "slot": "UTIL",
    "s1": 20,
    "s2": 22,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2285",
    "name": "Trey Murphy",
    "status": "active",
    "slot": "SG",
    "s1": 12,
    "s2": 14,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2286",
    "name": "Herbert Jones",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2296",
    "name": "Sandro Mamukelashvili",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2302",
    "name": "Neemias Queta",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2305",
    "name": "Jalen Suggs",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2435",
    "name": "Bennedict Mathurin",
    "status": "active",
    "slot": null,
    "s1": 2,
    "s2": 3,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2439",
    "name": "Jaden Ivey",
    "status": "active",
    "slot": null,
    "s1": 2,
    "s2": 3,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2468",
    "name": "Max Christie",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2476",
    "name": "Shaedon Sharpe",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 3,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2488",
    "name": "Gui Santos",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2584",
    "name": "Dereck Lively",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2728",
    "name": "Donovan Clingan",
    "status": "active",
    "slot": "C",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2836",
    "name": "Ronald Holland",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4760",
    "name": "Cooper Flagg",
    "status": "active",
    "slot": "PG",
    "s1": 61,
    "s2": 68,
    "src": "kept",
    "ir": "unknown"
   }
  ]
 },
 {
  "key": "submissivemale",
  "team": "Submissive Male",
  "manager": "DaddiesDumpah",
  "emptyStarters": 0,
  "players": [
   {
    "id": "1613",
    "name": "Karl-Anthony Towns",
    "status": "active",
    "slot": "C",
    "s1": null,
    "s2": 23,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "1637",
    "name": "Norman Powell",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1711",
    "name": "Jaylen Brown",
    "status": "active",
    "slot": "SF",
    "s1": null,
    "s2": 11,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "1716",
    "name": "Pascal Siakam",
    "status": "active",
    "slot": "UTIL",
    "s1": 29,
    "s2": 32,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1787",
    "name": "Jarrett Allen",
    "status": "active",
    "slot": null,
    "s1": 9,
    "s2": 10,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1830",
    "name": "Derrick White",
    "status": "active",
    "slot": "SG",
    "s1": null,
    "s2": 10,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2126",
    "name": "Tyrese Maxey",
    "status": "active",
    "slot": "PG",
    "s1": 21,
    "s2": 24,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2179",
    "name": "LaMelo Ball",
    "status": "active",
    "slot": "UTIL",
    "s1": 32,
    "s2": 36,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2284",
    "name": "Jalen Johnson",
    "status": "active",
    "slot": "PF",
    "s1": 17,
    "s2": 19,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2590",
    "name": "Anthony Black",
    "status": "ir",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "not",
    "irNote": "a game-time decision, not Out"
   },
   {
    "id": "2722",
    "name": "Stephon Castle",
    "status": "active",
    "slot": "UTIL",
    "s1": 2,
    "s2": 3,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2724",
    "name": "Isaiah Collier",
    "status": "taxi",
    "slot": null,
    "s1": 1,
    "s2": 1,
    "src": "kept-taxi",
    "ir": "unknown"
   },
   {
    "id": "4748",
    "name": "Cedric Coward",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 2,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4752",
    "name": "Hugo González",
    "status": "taxi",
    "slot": null,
    "s1": 1,
    "s2": 1,
    "src": "kept-taxi",
    "ir": "unknown"
   },
   {
    "id": "4873",
    "name": "Cameron Boozer",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 30,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4882",
    "name": "Darryn Peterson",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 10,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4885",
    "name": "Morez Johnson",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 2,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4888",
    "name": "Aday Mara",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4891",
    "name": "Darius Acuff",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 2,
    "src": "auction",
    "ir": "unknown"
   }
  ]
 },
 {
  "key": "suckitmitch",
  "team": "Suck it Mitch",
  "manager": "pgcannon2000",
  "emptyStarters": 0,
  "players": [
   {
    "id": "1265",
    "name": "Jrue Holiday",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1450",
    "name": "CJ McCollum",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "1585",
    "name": "Aaron Gordon",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1658",
    "name": "Nikola Jokić",
    "status": "active",
    "slot": "C",
    "s1": 81,
    "s2": 90,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1822",
    "name": "Jayson Tatum",
    "status": "active",
    "slot": "SF",
    "s1": 31,
    "s2": 35,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2131",
    "name": "Saddiq Bey",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2133",
    "name": "Anthony Edwards",
    "status": "active",
    "slot": "PG",
    "s1": 71,
    "s2": 79,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2136",
    "name": "Onyeka Okongwu",
    "status": "active",
    "slot": "UTIL",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2142",
    "name": "Payton Pritchard",
    "status": "active",
    "slot": "SG",
    "s1": 3,
    "s2": 4,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2146",
    "name": "Devin Vassell",
    "status": "active",
    "slot": "UTIL",
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2255",
    "name": "Ayo Dosunmu",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2456",
    "name": "Keegan Murray",
    "status": "active",
    "slot": "PF",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2463",
    "name": "Ryan Rollins",
    "status": "active",
    "slot": "UTIL",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2494",
    "name": "Julian Champagnie",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2564",
    "name": "Brandin Podziemski",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2715",
    "name": "Bub Carrington",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4875",
    "name": "Zuby Ejiofor",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   }
  ]
 },
 {
  "key": "thonmakercome",
  "team": "thonmakercome",
  "manager": "thonmakercome",
  "emptyStarters": 0,
  "players": [
   {
    "id": "1085",
    "name": "Stephen Curry",
    "status": "active",
    "slot": "PG",
    "s1": 33,
    "s2": 37,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1511",
    "name": "Joel Embiid",
    "status": "active",
    "slot": "UTIL",
    "s1": 18,
    "s2": 20,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1535",
    "name": "Julius Randle",
    "status": "active",
    "slot": null,
    "s1": 8,
    "s2": 9,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1697",
    "name": "Ivica Zubac",
    "status": "active",
    "slot": "C",
    "s1": 7,
    "s2": 8,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1698",
    "name": "Brandon Ingram",
    "status": "ir",
    "slot": null,
    "s1": 4,
    "s2": 5,
    "src": "kept",
    "ir": "out"
   },
   {
    "id": "2086",
    "name": "Tyler Herro",
    "status": "active",
    "slot": "UTIL",
    "s1": 5,
    "s2": 6,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2090",
    "name": "Ty Jerome",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2181",
    "name": "Deni Avdija",
    "status": "active",
    "slot": "PF",
    "s1": 2,
    "s2": 3,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2289",
    "name": "Scottie Barnes",
    "status": "active",
    "slot": "SF",
    "s1": 25,
    "s2": 28,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2309",
    "name": "Jalen Green",
    "status": "active",
    "slot": null,
    "s1": 10,
    "s2": 11,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2313",
    "name": "Josh Giddey",
    "status": "active",
    "slot": "UTIL",
    "s1": 20,
    "s2": 22,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2449",
    "name": "Dyson Daniels",
    "status": "active",
    "slot": null,
    "s1": 25,
    "s2": 28,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2453",
    "name": "Jalen Williams",
    "status": "active",
    "slot": "SG",
    "s1": 18,
    "s2": 20,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2583",
    "name": "Jaime Jaquez Jr.",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "4737",
    "name": "VJ Edgecombe",
    "status": "active",
    "slot": null,
    "s1": 10,
    "s2": 11,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "4758",
    "name": "Ace Bailey",
    "status": "active",
    "slot": null,
    "s1": 4,
    "s2": 5,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "4874",
    "name": "Cameron Carr",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4884",
    "name": "Nate Ament",
    "status": "taxi",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   }
  ]
 },
 {
  "key": "yousagoffyourswagsoff",
  "team": "YouSagOffYourSwagsOff",
  "manager": "porvida",
  "emptyStarters": 0,
  "players": [
   {
    "id": "1272",
    "name": "Anthony Davis",
    "status": "active",
    "slot": "PF",
    "s1": 44,
    "s2": 49,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1350",
    "name": "Rudy Gobert",
    "status": "active",
    "slot": "UTIL",
    "s1": 2,
    "s2": 3,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1648",
    "name": "Devin Booker",
    "status": "active",
    "slot": "PG",
    "s1": 51,
    "s2": 57,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1713",
    "name": "Dejounte Murray",
    "status": "active",
    "slot": "UTIL",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1831",
    "name": "OG Anunoby",
    "status": "active",
    "slot": "SF",
    "s1": 3,
    "s2": 4,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "1883",
    "name": "Wendell Carter",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "1964",
    "name": "Donte DiVincenzo",
    "status": "ir",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "out"
   },
   {
    "id": "2091",
    "name": "Cameron Johnson",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2143",
    "name": "Desmond Bane",
    "status": "active",
    "slot": "SG",
    "s1": 7,
    "s2": 8,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2157",
    "name": "Immanuel Quickley",
    "status": "active",
    "slot": null,
    "s1": 6,
    "s2": 7,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2301",
    "name": "Davion Mitchell",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "2445",
    "name": "Jabari Smith",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2577",
    "name": "Victor Wembanyama",
    "status": "active",
    "slot": "C",
    "s1": 79,
    "s2": 87,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2580",
    "name": "Keyonte George",
    "status": "active",
    "slot": "UTIL",
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2719",
    "name": "Reed Sheppard",
    "status": "active",
    "slot": null,
    "s1": 1,
    "s2": 2,
    "src": "kept",
    "ir": "unknown"
   },
   {
    "id": "2737",
    "name": "Zaccharie Risacher",
    "status": "active",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "unknown"
   },
   {
    "id": "4793",
    "name": "Maxime Raynaud",
    "status": "ir",
    "slot": null,
    "s1": null,
    "s2": 1,
    "src": "auction",
    "ir": "out"
   }
  ]
 }
];
