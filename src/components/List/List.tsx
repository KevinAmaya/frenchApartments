import { readFileSync } from 'fs';
import { join } from 'path';
import { ListWrapper } from './List.styled';
import ListClient from './ListClient';
import { imageUrl } from '@/lib/imageUrl';

interface ApartmentListing {
  source: string;
  location: string;
  url: string;
  size: string;
  price: string;
  bedrooms: string;
  dateFound: string;
  isGood: string;
  section: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

function getListings(): { listings: ApartmentListing[], sections: string[] } {
  try {
    const filePath = join(process.cwd(), 'scrapper', "listings.csv");
    const fileContent = readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    const listings: ApartmentListing[] = [];
    const sections: string[] = [];
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Check if this line is a section header (single word, all caps or title case)
      if (/^[A-Za-z]+$/.test(line) && !line.includes(',')) {
        currentSection = line;
        if (!sections.includes(currentSection)) {
          sections.push(currentSection);
        }
        continue; // Skip to next line (which will be the header row)
      }

      // Skip CSV header rows
      if (line.includes('Source,Location') || line.includes('Source') && line.includes('URL')) {
        continue;
      }

      const parts = parseCSVLine(line);
      if (parts.length >= 7) {
        const source = parts[0]?.replace(/^"|"$/g, '') || '';

        // Only add as listing if we have a source and location
        if (source && source !== 'Source') {
          let location = '';
          let url = '';
          let size = '';
          let price = '';
          let bedrooms = '';
          let dateFound = '';
          let isGood = '';

          // Check if parts[2] is a URL to determine the CSV structure
          const isUrlInParts2 = (parts[2] || '').includes('http');

          if (isUrlInParts2) {
            // PAP/Leboncoin structure: Source, Location, URL, Size, Price, Bedrooms, DateFound, IsGood
            location = (parts[1] || '').replace(/^"|"$/g, '');
            url = parts[2] || '';
            size = parts[3] || '';
            price = parts[4] || '';
            bedrooms = parts[5] || '';
            dateFound = parts[6] || '';
            isGood = parts[7] || '';
          } else {
            // SeLoger structure: Source, Location(3 parts), URL, Size, Price, Bedrooms, DateFound, IsGood
            location = (parts[1] || '').replace(/^"|"$/g, '');
            const city = (parts[2] || '').replace(/^"|"$/g, '');
            const postal = (parts[3] || '').replace(/^"|"$/g, '');

            if (city) location += `, ${city}`;
            if (postal) location += ` ${postal}`;

            url = parts[4] || '';
            size = parts[5] || '';
            price = parts[6] || '';
            bedrooms = parts[7] || '';
            dateFound = parts[8] || '';
            isGood = parts[9] || '';
          }

          listings.push({
            source,
            location,
            url,
            size,
            price,
            bedrooms,
            dateFound,
            isGood,
            section: currentSection,
          });
        }
      }
    }

    return { listings, sections };
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return { listings: [], sections: [] };
  }
}

export default function List() {
  const { listings, sections } = getListings();

  return (
    <ListWrapper data-testid="List">
      <div className="list">
        <div className="list__title-wrap">
          <img alt="" src={imageUrl('/images/houses.gif')} width={100} height={100} />
          <h1 className="list__title"> Apartments: </h1>
        </div>
        <ListClient listings={listings} sections={sections} />
      </div>
    </ListWrapper>
  );
}
