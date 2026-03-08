import axios from "axios";
import { processEvent } from "./processEvent.js";

function extractPrize(prizeString) {
 if (!prizeString) return 0;

 const match = prizeString.match(/[\d,]+/);
 return match ? parseInt(match[0].replace(/,/g, "")) : 0;
}

async function fetchUnstop() {

 const url =
  "https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&page=1&per_page=10";

 const res = await axios.get(url);

 return res.data.data.data.map(h => ({
  title: h.title,
  organization: h.organisation?.name || "Unknown",
  location: h.address_with_country_logo?.city || "Online",
  mode: h.region || "online",
  prize: h.prizes?.[0]?.cash || 0,
  deadline: h.regnRequirements?.end_regn_dt || "",
  url: h.seo_url || "",
  skills: (h.required_skills || []).map(s => s.skill)
 }));
}

async function fetchDevpost() {

 const url = "https://devpost.com/api/hackathons";

 const res = await axios.get(url);

 return res.data.hackathons.map(h => ({
  title: h.title,
  organization: h.organization_name || "Unknown",
  location: h.displayed_location?.location || "Online",
  mode: h.displayed_location?.location === "Online" ? "online" : "offline",
  prize: extractPrize(h.prize_amount),
  deadline: h.submission_period_dates || "",
  url: h.url || "",
  skills: (h.themes || []).map(t => t.name)
 }));
}

export async function crawlHackathons() {

 try {

  const unstopEvents = await fetchUnstop();
  const devpostEvents = await fetchDevpost();

  const events = [...unstopEvents, ...devpostEvents];

  console.log(`Found ${events.length} hackathons`);

  for (const event of events) {
   await processEvent(event);
  }

  console.log("All hackathons processed");

 } catch (error) {
  console.error("Crawler error:", error.message);
 }

}