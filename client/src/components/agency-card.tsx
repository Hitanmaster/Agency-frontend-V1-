import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MongoAgency } from "@shared/schema";
import { formatDate } from "@/lib/format-date";
import { Skeleton } from "@/components/ui/skeleton";

interface AgencyCardProps {
  agency: MongoAgency;
  index: number;
  onClick: (agency: MongoAgency) => void;
}

export default function AgencyCard({ agency, index, onClick }: AgencyCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Determine card size variant based on index
  // This creates an interesting masonry layout pattern
  const getCardVariant = (index: number) => {
    const mod = index % 6;
    if (mod === 0 || mod === 4) return "card-1"; // tall
    if (mod === 2) return "card-3"; // tall
    return "card-2"; // regular
  };

  const cardVariant = getCardVariant(index);
  
  // Get the first image or fallback to a placeholder
  const imageUrl = agency.project_images && agency.project_images.length > 0 
    ? agency.project_images[0] 
    : `https://via.placeholder.com/400x600?text=${encodeURIComponent(agency.agency_name)}`;

  // Determine aspect ratio based on card variant
  const aspectRatio = cardVariant === "card-1" || cardVariant === "card-3" 
    ? "aspect-[3/4]" 
    : "aspect-[4/3]";

  return (
    <Card 
      className={`${cardVariant} agency-card bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
      onClick={() => onClick(agency)}
    >
      <div className={`image-container ${aspectRatio}`}>
        {!imageLoaded && !imageError && (
          <Skeleton className="w-full h-full" />
        )}
        
        {!imageError ? (
          <img 
            src={imageUrl}
            alt={`${agency.agency_name} - ${agency.project_title || 'Project'}`}
            className={`w-full h-full object-cover ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-100">
            <span className="text-neutral-400 font-medium text-lg">{agency.agency_name.substring(0, 2).toUpperCase()}</span>
          </div>
        )}
        
        <div className="image-overlay">
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-white text-neutral-700 hover:bg-neutral-100 transition-colors" aria-label="View Details">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 0 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{agency.agency_name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-neutral-500 text-sm truncate">{agency.project_title || "Project"}</p>
          <p className="text-xs text-neutral-400">{formatDate(agency.scraped_date)}</p>
        </div>
      </div>
    </Card>
  );
}
