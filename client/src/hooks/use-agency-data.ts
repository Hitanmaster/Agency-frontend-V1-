import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { MongoAgency } from "@shared/schema";

interface AgencyQueryParams {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
  endpoint?: string;
}

interface AgencyResponse {
  agencies: MongoAgency[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

interface TagsResponse {
  tags: string[];
}

export function useAgencyData({ page = 1, limit = 12, tag, search, endpoint = "agencies" }: AgencyQueryParams) {
  // For fetching tags, use a regular query
  if (endpoint === "tags") {
    return useQuery<TagsResponse>({
      queryKey: ["/api/tags"],
    });
  }

  // For fetching agencies, use an infinite query
  return useInfiniteQuery<AgencyResponse>({
    queryKey: ["/api/agencies", { tag, search }],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.append("page", pageParam.toString());
      params.append("limit", limit.toString());
      
      if (tag) params.append("tag", tag);
      if (search) params.append("search", search);
      
      const response = await fetch(`/api/agencies?${params.toString()}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error fetching agencies: ${response.status}`);
      }
      
      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 60000, // 1 minute
  });
}
