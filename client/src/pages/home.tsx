import { useState } from "react";
import Header from "@/components/header";
import FilterBar from "@/components/filter-bar";
import MasonryGrid from "@/components/masonry-grid";
import ErrorDisplay from "@/components/error-display";
import LoadingSkeleton from "@/components/loading-skeleton";
import AgencyDetailModal from "@/components/agency-detail-modal";
import { useAgencyData } from "@/hooks/use-agency-data";
import { MongoAgency } from "@shared/schema";

export default function Home() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [selectedAgency, setSelectedAgency] = useState<MongoAgency | null>(null);

  // Fetch agency data
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    isFetchingNextPage, 
    fetchNextPage, 
    hasNextPage,
    refetch
  } = useAgencyData({ page, limit, tag: selectedTag, search });

  // Fetch tags for filter
  const { data: tagsData } = useAgencyData({ endpoint: "tags" });
  const tags = tagsData?.tags || [];

  // Handle search
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // Handle tag selection
  const handleTagSelect = (tag: string | undefined) => {
    setSelectedTag(tag);
    setPage(1);
  };

  // Handle infinite scroll
  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
      setPage(prevPage => prevPage + 1);
    }
  };

  // Handle agency selection for modal
  const handleAgencySelect = (agency: MongoAgency) => {
    setSelectedAgency(agency);
  };

  // Handle modal close
  const handleModalClose = () => {
    setSelectedAgency(null);
  };

  // Handle retry on error
  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={handleSearch} />
      
      <div className="container mx-auto px-4">
        <FilterBar 
          selectedTag={selectedTag}
          tags={tags}
          onTagSelect={handleTagSelect}
        />
        
        {isLoading && <LoadingSkeleton />}
        
        {isError && (
          <ErrorDisplay 
            message={error?.message || "Failed to load agencies"} 
            onRetry={handleRetry} 
          />
        )}
        
        {!isLoading && !isError && data && (
          <MasonryGrid 
            agencies={data.pages.flatMap(page => page.agencies)}
            onAgencySelect={handleAgencySelect}
            onLoadMore={handleLoadMore}
            isLoading={isFetchingNextPage}
            hasMore={hasNextPage}
          />
        )}
      </div>
      
      {selectedAgency && (
        <AgencyDetailModal 
          agency={selectedAgency} 
          onClose={handleModalClose} 
        />
      )}
    </div>
  );
}
