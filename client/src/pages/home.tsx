import { useState } from "react";
import Header from "@/components/header";
import FilterBar from "@/components/filter-bar";
import MasonryGrid from "@/components/masonry-grid";
import ErrorDisplay from "@/components/error-display";
import LoadingSkeleton from "@/components/loading-skeleton";
import AgencyDetailModal from "@/components/agency-detail-modal";
import { useAgencyData, AgencyResponse } from "@/hooks/use-agency-data";
import { MongoAgency } from "@shared/schema";

export default function Home() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [selectedAgency, setSelectedAgency] = useState<MongoAgency | null>(null);
  const [randomMode, setRandomMode] = useState(false);

  // Fetch agency data
  const agencyQuery = useAgencyData({ 
    page, 
    limit, 
    tag: selectedTag, 
    search,
    random: randomMode 
  });
  
  // Type assertion to fix TypeScript errors
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch
  } = agencyQuery;
  
  // These properties are only available on infinite queries
  const isFetchingNextPage = 'isFetchingNextPage' in agencyQuery ? agencyQuery.isFetchingNextPage : false;
  const fetchNextPage = 'fetchNextPage' in agencyQuery ? agencyQuery.fetchNextPage : () => {};
  const hasNextPage = 'hasNextPage' in agencyQuery ? agencyQuery.hasNextPage : false;

  // Fetch tags for filter
  const tagsQuery = useAgencyData({ endpoint: "tags" });
  const tags = tagsQuery.data && 'tags' in tagsQuery.data ? tagsQuery.data.tags : [];

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
  
  // Handle random mode toggle
  const handleRandomModeToggle = (enabled: boolean) => {
    setRandomMode(enabled);
    setPage(1);
    refetch();
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
          randomMode={randomMode}
          onRandomModeToggle={handleRandomModeToggle}
        />
        
        {isLoading && <LoadingSkeleton />}
        
        {isError && (
          <ErrorDisplay 
            message={error?.message || "Failed to load agencies"} 
            onRetry={handleRetry} 
          />
        )}
        
        {!isLoading && !isError && data && 'pages' in data && (
          <MasonryGrid 
            agencies={data.pages.flatMap((page: AgencyResponse) => page.agencies)}
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
