import { useRef, useEffect } from "react";
import AgencyCard from "./agency-card";
import { MongoAgency } from "@shared/schema";

interface MasonryGridProps {
  agencies: MongoAgency[];
  onAgencySelect: (agency: MongoAgency) => void;
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean | undefined;
}

export default function MasonryGrid({ 
  agencies, 
  onAgencySelect, 
  onLoadMore, 
  isLoading, 
  hasMore 
}: MasonryGridProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, onLoadMore]);

  // Apply custom styles for masonry grid
  return (
    <>
      <style jsx="true">{`
        .masonry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          grid-gap: 20px;
          grid-auto-flow: dense;
        }
        
        @media (min-width: 768px) {
          .masonry-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          }
        }
        
        @media (min-width: 1024px) {
          .masonry-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }
        
        @media (min-width: 1280px) {
          .masonry-grid {
            grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          }
        }
        
        .card-1 { grid-row: span 2; }
        .card-2 { grid-row: span 1; }
        .card-3 { grid-row: span 2; }
        
        .image-container {
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem;
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.2);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .image-container:hover .image-overlay {
          opacity: 1;
        }
      `}</style>
      
      <div className="masonry-grid pb-20">
        {agencies.map((agency, index) => (
          <AgencyCard 
            key={agency._id} 
            agency={agency} 
            index={index}
            onClick={onAgencySelect}
          />
        ))}
      </div>
      
      {(hasMore || isLoading) && (
        <div 
          ref={observerTarget}
          className="flex justify-center mt-8 mb-20"
        >
          {isLoading && (
            <div className="w-10 h-10 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
          )}
        </div>
      )}
    </>
  );
}
