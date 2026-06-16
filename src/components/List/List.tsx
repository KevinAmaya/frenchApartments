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
    const filePath = join(process.cwd(), 'Data', "Wendo's apartments - seloger_listings.csv");
    const fileContent = readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    const listings: ApartmentListing[] = [];
    const sections: string[] = [];
    let currentSection = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = parseCSVLine(line);
      if (parts.length >= 7) {
        const source = parts[0] || '';
        const location = parts[1] || '';

        // Check if this is a section header (has source but empty other fields)
        if (source && !location && !parts[2] && !parts[3] && !parts[4] && !parts[5]) {
          currentSection = source;
          if (!sections.includes(currentSection)) {
            sections.push(currentSection);
          }
        } else if (source && location) {
          listings.push({
            source,
            location,
            url: parts[2] || '',
            size: parts[3] || '',
            price: parts[4] || '',
            bedrooms: parts[5] || '',
            isGood: parts[6] || '',
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
