import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Shuffle } from "lucide-react";

interface FilterBarProps {
  tags: string[];
  selectedTag?: string;
  onTagSelect: (tag: string | undefined) => void;
  randomMode: boolean;
  onRandomModeToggle: (enabled: boolean) => void;
}

export default function FilterBar({ 
  tags, 
  selectedTag, 
  onTagSelect, 
  randomMode, 
  onRandomModeToggle 
}: FilterBarProps) {
  const [sortOrder, setSortOrder] = useState("newest");

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    // Sorting is handled by the API, so no additional action needed here
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 py-4">
      <div className="flex items-center flex-wrap gap-2">
        <Button
          variant={!selectedTag ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onTagSelect(undefined)}
        >
          All
        </Button>
        
        {tags.map(tag => (
          <Button
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            className="rounded-full"
            onClick={() => onTagSelect(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center space-x-2">
          <Switch 
            id="random-mode" 
            checked={randomMode}
            onCheckedChange={onRandomModeToggle}
          />
          <Label htmlFor="random-mode" className="flex items-center cursor-pointer">
            <Shuffle className="h-4 w-4 mr-1 text-neutral-500" />
            <span className="text-sm text-neutral-500">Random</span>
          </Label>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Sort by:</span>
          <Select 
            value={sortOrder} 
            onValueChange={handleSortChange}
            disabled={randomMode}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
