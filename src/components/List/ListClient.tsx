'use client';
import { useState } from 'react';

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

interface ListClientProps {
  listings: ApartmentListing[];
  sections: string[];
}

type SortKey = 'source' | 'location' | 'size' | 'price' | 'bedrooms' | null;
type SortOrder = 'asc' | 'desc';

export default function ListClient({ listings, sections }: ListClientProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  let filteredListings = selectedSection
    ? listings.filter(l => l.section === selectedSection)
    : listings;

  if (sortKey) {
    filteredListings = [...filteredListings].sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];

      // Convert to numbers for numeric columns
      if (sortKey === 'size' || sortKey === 'price' || sortKey === 'bedrooms') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <>
      {/* Section buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSection(null)}
          className={`px-4 py-2 rounded text-sm font-medium transition ${
            selectedSection === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All Listings
        </button>
        {sections.map(section => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              selectedSection === section
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {section} ({listings.filter(l => l.section === section).length})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-800">
            <tr>
              <th
                onClick={() => handleSort('source')}
                className={`border border-gray-300 px-4 py-2 text-left text-sm cursor-pointer hover:bg-gray-700 ${sortKey === 'source' ? 'font-bold' : ''}`}
              >
                Source {sortKey === 'source' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('location')}
                className={`border border-gray-300 px-4 py-2 text-left text-sm cursor-pointer hover:bg-gray-700 ${sortKey === 'location' ? 'font-bold' : ''}`}
              >
                Location {sortKey === 'location' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('size')}
                className={`border border-gray-300 px-4 py-2 text-left text-sm cursor-pointer hover:bg-gray-700 ${sortKey === 'size' ? 'font-bold' : ''}`}
              >
                Size (m²) {sortKey === 'size' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('price')}
                className={`border border-gray-300 px-4 py-2 text-left text-sm cursor-pointer hover:bg-gray-700 ${sortKey === 'price' ? 'font-bold' : ''}`}
              >
                Price (€) {sortKey === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('bedrooms')}
                className={`border border-gray-300 px-4 py-2 text-left text-sm cursor-pointer hover:bg-gray-700 ${sortKey === 'bedrooms' ? 'font-bold' : ''}`}
              >
                Bedrooms {sortKey === 'bedrooms' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">Link</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map((listing, index) => (
              <tr key={index} className="hover:bg-gray-600">
                <td className="border border-gray-300 px-4 py-2 text-sm">{listing.source}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{listing.location}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{listing.size}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{listing.price}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{listing.bedrooms}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {listing.url ? (
                    <a href={listing.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                      View
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredListings.length} of {listings.length} listings
      </div>
    </>
  );
}
