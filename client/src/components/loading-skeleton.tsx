import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  // Create an array of 8 elements for the skeleton loader
  const skeletons = Array.from({ length: 8 }, (_, i) => i);
  
  return (
    <div className="masonry-grid py-8">
      {skeletons.map((index) => {
        // Determine the skeleton height based on a pattern similar to the actual cards
        const isLarge = index % 3 === 0 || index % 3 === 2;
        const height = isLarge ? "h-[400px]" : "h-[300px]";
        
        return (
          <div key={index} className="rounded-xl overflow-hidden">
            <Skeleton className={`w-full ${height}`} />
            <div className="p-3 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        );
      })}
      
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
      `}</style>
    </div>
  );
}
