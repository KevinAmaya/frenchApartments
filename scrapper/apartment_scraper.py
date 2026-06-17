#!/usr/bin/env python3
"""
Apartment web scraper for SeLoger, PAP, and Leboncoin
Exports results to CSV with section headers for each search query
"""

import json
import re
import csv
import sys
import os
from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
from seleniumbase import Driver
import lbc

# Configuration: Define search queries
SEARCHES = [
    {
        "title": "Hauts-de-Seine (Paris suburbs) - 500-650€",
        "website": "SeLoger",
        "url": "https://www.seloger.com/classified-search?distributionTypes=Rent&estateTypes=House,Apartment&locations=eyJwbGFjZUlkIjoiQUQwOEZSMzY2OTIiLCJyYWRpdXMiOjUxLCJwb2x5bGluZSI6Im9sdWtIY2F0TXB2QHp2WWpjRGJ1WHZpR35yVnJlSmpzU2pzTGJ6T2RwTmpsS255T3xvRmJuUHpqQWBtUGN6QXZ2T3d8RnprTl91S2xuTGV9T3BgSmlwU25lR2tqVnBgRGdoWHB1QHVnWXF1QHVnWXFgRGdoWG9lR2tqVnFgSmlwU21uTGV9T3trTl81S3d2T3l8RmFtUGN6QWNuUHxqQW95T3xvRmVwTmpsS2tzTGJ6T3NlSmhzU3dpR35yVmtjRGJ1WHF2QHx2WSIsImNvb3JkaW5hdGVzIjp7ImxhdCI6NDguODA4NjU1NDM3MTU2NTc0LCJsbmciOjIuNDAxNjIxMjIyODc2MTczfX0&priceMax=650&priceMin=500&surfaceMin=20&m=classifed_search_results_map_switch_button_to_classified_search_results",
        "maxResults": 100,
    },
    {
        "title": "Hauts-de-Seine (PAP) - 500-650€",
        "website": "PAP",
        "url": "https://www.pap.fr/annonce/locations-appartement-hauts-de-seine-92-g456-du-studio-au-4-pieces-jusqu-a-650-euros",
        "maxResults": 100,
    },
    {
        "title": "Hauts-de-Seine (Leboncoin) - 500-650€",
        "website": "Leboncoin",
        "url": None,  # Not used for Leboncoin; we use API parameters instead
        "maxResults": 100,
    },
]

CSV_COLUMNS = ["Source", "Location", "URL", "Size (m²)", "Price (€/month)", "Bedrooms", "Date Found", "Is it good?"]


def extract_seloger_ufrn(html: str) -> Optional[Dict[str, Any]]:
    """Extract UFRN fetcher payload from SeLoger HTML."""
    m = re.search(
        r'window\["__UFRN_FETCHER__"\]=JSON\.parse\("(.+?)"\);\s*</script>',
        html,
        re.DOTALL,
    )
    if not m:
        return None
    return json.loads(m.group(1).encode().decode("unicode_escape"))


def scrape_seloger(url: str, max_results: int, date_found: str = None) -> List[Dict[str, Any]]:
    """Scrape SeLoger apartments."""
    if date_found is None:
        date_found = datetime.now().strftime("%Y-%m-%d")
    print(f"  Scraping SeLoger (target: {max_results})...", end=" ", flush=True)
    driver = Driver(browser="chrome", uc=True, headless=False)
    all_ids = []
    all_data = {}
    seen_ids = set()

    try:
        for page_num in range(1, 30):  # Max 30 pages
            url_with_page = f"{url}&page={page_num}" if "?" in url else f"{url}?page={page_num}"

            if page_num == 1:
                driver.uc_open_with_reconnect(url_with_page, reconnect_time=6)
            else:
                driver.get(url_with_page)
            driver.sleep(4)

            payload = extract_seloger_ufrn(driver.page_source)
            if not payload:
                break

            pp = payload["data"]["classified-serp-init-data"]["pageProps"]
            page_ids = pp.get("classifieds", [])
            page_data = pp.get("classifiedsData", {})

            if not page_ids:
                break

            new_ids = [i for i in page_ids if i not in seen_ids]
            seen_ids.update(new_ids)
            all_ids.extend(new_ids)
            all_data.update(page_data)

            qualifying = sum(
                1
                for lid in all_ids
                if ((all_data.get(lid) or {}).get("rawData") or {}).get("surface", {})
                and (all_data.get(lid)["rawData"]["surface"].get("main") or 0) > 20
            )

            if qualifying >= max_results:
                break

        # Parse listings
        rows = []
        for listing_id in all_ids:
            listing = all_data.get(listing_id)
            if not listing:
                continue
            surface = (listing.get("rawData", {}).get("surface") or {}).get("main") or 0
            if surface <= 20:
                continue

            addr = listing.get("location", {}).get("address", {})
            location = ", ".join(filter(None, [addr.get("district"), addr.get("city"), addr.get("zipCode")]))

            rows.append({
                "Source": "SeLoger",
                "Location": location,
                "URL": listing.get("url", ""),
                "Size (m²)": surface,
                "Price (€/month)": listing.get("rawData", {}).get("price"),
                "Bedrooms": listing.get("rawData", {}).get("nbbedroom"),
                "Date Found": date_found,
                "Is it good?": "",
            })

        print(f"✓ {len(rows)} results")
        return rows

    finally:
        driver.quit()


def scrape_pap(url: str, max_results: int, date_found: str = None) -> List[Dict[str, Any]]:
    """Scrape PAP apartments."""
    if date_found is None:
        date_found = datetime.now().strftime("%Y-%m-%d")
    print(f"  Scraping PAP (target: {max_results})...", end=" ", flush=True)
    driver = Driver(browser="chrome", uc=True, headless=False)
    all_rows = []
    current_url = url

    try:
        page_num = 0
        while current_url and page_num < 30:
            page_num += 1

            if page_num == 1:
                driver.uc_open_with_reconnect(current_url, reconnect_time=6)
            else:
                driver.get(current_url)
            driver.sleep(4)

            soup = BeautifulSoup(driver.page_source, "html.parser")
            rows = []
            for item in soup.find_all(class_="search-list-item-alt"):
                body = item.find(class_="item-body")
                if not body:
                    continue
                link = body.find(class_="item-title")
                if not link:
                    continue

                url_href = "https://www.pap.fr" + link.get("href", "")
                location = (link.find("span", class_="h1") or link.find("h1") or link.find("span")).get_text(
                    strip=True
                )
                price_text = (
                    (body.find(class_="item-price") or object()).get_text(strip=True)
                    if body.find(class_="item-price")
                    else ""
                )
                price = int(re.sub(r"[^\d]", "", price_text)) if price_text else None

                tags = [li.get_text(strip=True) for li in body.select("ul.item-tags li")]
                size, bedrooms = None, None
                for tag in tags:
                    m = re.match(r"([\d,\.]+)\s*m", tag)
                    if m:
                        size = float(m.group(1).replace(",", "."))
                    m = re.match(r"(\d+)\s*chambre", tag, re.I)
                    if m:
                        bedrooms = int(m.group(1))

                if size and size > 20:
                    rows.append({
                        "Source": "PAP",
                        "Location": location,
                        "URL": url_href,
                        "Size (m²)": size,
                        "Price (€/month)": price,
                        "Bedrooms": bedrooms,
                        "Date Found": date_found,
                        "Is it good?": "",
                    })

            all_rows.extend(rows)

            # Find next page link
            next_link = soup.select_one("#pagination-next")
            current_url = "https://www.pap.fr" + next_link["href"] if next_link else None

            if len(all_rows) >= max_results:
                break

        print(f"✓ {len(all_rows)} results")
        return all_rows

    finally:
        driver.quit()


def scrape_leboncoin(max_results: int, date_found: str = None, debug: bool = False) -> List[Dict[str, Any]]:
    """Scrape Leboncoin apartments using the lbc library.

    Args:
        max_results: Maximum number of listings to collect
        date_found: Date to mark listings with (default: today)
        debug: If True, print attribute keys from first listing to help debug missing data
    """
    if date_found is None:
        date_found = datetime.now().strftime("%Y-%m-%d")
    print(f"  Scraping Leboncoin (target: {max_results})...", end=" ", flush=True)
    client = lbc.Client()
    lbc_rows = []

    try:
        for page in range(1, 30):  # Max 30 pages
            results = client.search(
                category=lbc.Category.IMMOBILIER_LOCATIONS,
                locations=lbc.Department.HAUTS_DE_SEINE,
                price=(400, 700),
                page=page,
                limit=100,
            )

            if not results.ads:
                break

            for ad in results.ads:

                surface = None
                bedrooms = None

                # ad.attributes is a dictionary with Attribute objects
                if isinstance(ad.attributes, dict):
                    square_attr = ad.attributes.get("square")
                    if square_attr and hasattr(square_attr, "value") and square_attr.value:
                        try:
                            surface = float(square_attr.value)
                        except:
                            pass

                    rooms_attr = ad.attributes.get("rooms")
                    if rooms_attr and hasattr(rooms_attr, "value") and rooms_attr.value:
                        try:
                            bedrooms = int(rooms_attr.value)
                        except:
                            pass

                if surface is None or surface > 12:
                    lbc_rows.append({
                        "Source": "Leboncoin",
                        "Location": ad.location.city_label if hasattr(ad.location, 'city_label') else str(ad.location),
                        "URL": ad.url,
                        "Size (m²)": surface,
                        "Price (€/month)": int(ad.price),
                        "Bedrooms": bedrooms,
                        "Date Found": date_found,
                        "Is it good?": "",
                    })

            if len(lbc_rows) >= max_results:
                break

        print(f"✓ {len(lbc_rows)} results")
        return lbc_rows

    except Exception as e:
        print(f"✗ Error: {e}")
        return []


def scrape_all_sources(searches: List[Dict[str, Any]], websites: Optional[List[str]] = None, debug: bool = False) -> List[tuple[str, List[Dict[str, Any]]]]:
    """Scrape configured sources and return [(title, rows), ...].

    Args:
        searches: List of search configurations
        websites: Optional list of websites to scrape (e.g., ["SeLoger", "PAP"]). If None, scrapes all.
        debug: If True, print debug info from scrapers
    """
    results = []
    date_found = datetime.now().strftime("%Y-%m-%d")

    for search in searches:
        title = search["title"]
        website = search["website"]
        url = search["url"]
        max_results = search["maxResults"]

        # Skip if specific websites are requested and this isn't one of them
        if websites and website.lower() not in [w.lower() for w in websites]:
            continue

        print(f"\n{title}")

        if website == "SeLoger":
            rows = scrape_seloger(url, max_results, date_found)
        elif website == "PAP":
            rows = scrape_pap(url, max_results, date_found)
        elif website == "Leboncoin":
            rows = scrape_leboncoin(max_results, date_found, debug)
        else:
            print(f"  Unknown website: {website}")
            continue

        results.append((title, rows))

    return results


def export_csv(results: List[tuple[str, List[Dict[str, Any]]]], output_file: str = "listings.csv"):
    """Export results to CSV, merging with existing data and removing old entries.

    Keeps listings for 30 days from their date found, then removes them.
    """
    cutoff_date = datetime.now() - timedelta(days=30)
    today = datetime.now().strftime("%Y-%m-%d")

    # Read existing data if file exists
    existing_rows = []
    seen_urls = set()

    if os.path.exists(output_file):
        try:
            with open(output_file, "r", encoding="utf-8-sig") as f:
                lines = f.readlines()

            # Parse the CSV using csv.reader for proper quote handling
            import io
            in_data = False
            current_fieldnames = None

            i = 0
            while i < len(lines):
                line = lines[i].strip()
                i += 1

                # Skip empty lines
                if not line:
                    in_data = False
                    continue

                # Check if this is a section header (source name)
                if line in ["SeLoger", "PAP", "Leboncoin"]:
                    in_data = True
                    continue

                # If this looks like column headers, set up the reader
                if in_data and "Source" in line:
                    reader = csv.reader(io.StringIO(line))
                    current_fieldnames = next(reader)
                    continue

                # Parse data rows using csv.reader for proper quote handling
                if in_data and current_fieldnames and line:
                    try:
                        reader = csv.reader(io.StringIO(line))
                        values = next(reader)

                        row = dict(zip(current_fieldnames, values))

                        # Only keep rows with valid Source field
                        if row.get("Source"):
                            # Parse date and check if it's within 30 days
                            try:
                                date_found = datetime.strptime(row.get("Date Found", today), "%Y-%m-%d")
                                if date_found >= cutoff_date:
                                    existing_rows.append(row)
                                    seen_urls.add(row.get("URL", ""))
                            except ValueError:
                                # Keep rows with invalid dates
                                existing_rows.append(row)
                                seen_urls.add(row.get("URL", ""))
                    except Exception as e:
                        # Skip malformed rows
                        pass
        except Exception as e:
            print(f"  Warning: Could not read existing file: {e}")

    # Combine new results with filtered existing data
    all_rows = {}  # Use dict to deduplicate by URL, keeping newest entry

    # Add existing rows first
    for row in existing_rows:
        url = row.get("URL", "")
        if url:
            all_rows[url] = row

    # Add/override with new data
    for title, rows in results:
        for row in rows:
            url = row.get("URL", "")
            if url:
                all_rows[url] = row

    # Organize by source
    by_source = {}
    for row in all_rows.values():
        source = row.get("Source", "Unknown")
        if source not in by_source:
            by_source[source] = []
        by_source[source].append(row)

    # Write to CSV
    with open(output_file, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)

        for source in ["SeLoger", "PAP", "Leboncoin"]:
            if source not in by_source:
                continue

            rows = by_source[source]

            # Write section header
            f.write(f"{source}\n")

            # Write column headers
            writer.writeheader()

            # Write data rows (sorted by date found, newest first)
            sorted_rows = sorted(rows, key=lambda x: x.get("Date Found", ""), reverse=True)
            for row in sorted_rows:
                writer.writerow(row)

            # Blank row separator
            f.write("\n")

    old_count = len(existing_rows)
    new_count = sum(len(rows) for _, rows in results)
    total_count = len(all_rows)

    print(f"\n✓ Exported to {output_file}")
    print(f"  Previous: {old_count} listings | New: {new_count} listings | Total: {total_count} listings")


def main():
    """Main entry point."""
    print("=" * 70)
    print("APARTMENT SCRAPER - SeLoger, PAP, Leboncoin")
    print("=" * 70)

    # Parse command-line arguments
    websites = None
    debug = False

    if len(sys.argv) > 1:
        args = sys.argv[1:]
        # Check for debug flag
        if "--debug" in args:
            debug = True
            args = [a for a in args if a != "--debug"]

        if args:
            websites = args
            valid_websites = ["SeLoger", "PAP", "Leboncoin"]
            invalid = [w for w in websites if w.lower() not in [v.lower() for v in valid_websites]]
            if invalid:
                print(f"Error: Unknown websites: {', '.join(invalid)}")
                print(f"Valid options: {', '.join(valid_websites)}")
                sys.exit(1)
            print(f"Scraping: {', '.join(websites)}\n")

    # Scrape sources
    results = scrape_all_sources(SEARCHES, websites, debug)

    if not results:
        print("No results to export.")
        return

    # Export to CSV
    export_csv(results, "listings.csv")

    # Print summary
    total_listings = sum(len(rows) for _, rows in results)
    print(f"\nTotal listings collected: {total_listings}")
    for title, rows in results:
        print(f"  {title}: {len(rows)}")


if __name__ == "__main__":
    main()
