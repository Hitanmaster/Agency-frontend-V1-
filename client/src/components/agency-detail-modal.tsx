import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MongoAgency } from "@shared/schema";
import { formatDate } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { X, ExternalLink, Bookmark } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AgencyDetailModalProps {
  agency: MongoAgency;
  onClose: () => void;
}

export default function AgencyDetailModal({ agency, onClose }: AgencyDetailModalProps) {
  const [open, setOpen] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  useEffect(() => {
    if (agency) {
      setOpen(true);
    }
  }, [agency]);

  // Get the current image URL or a fallback
  const currentImage = agency.project_images && agency.project_images.length > 0
    ? agency.project_images[currentImageIndex]
    : `https://via.placeholder.com/800x600?text=${encodeURIComponent(agency.agency_name)}`;

  // Handle image navigation
  const goToNextImage = () => {
    if (agency.project_images && currentImageIndex < agency.project_images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const goToPrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl mx-auto rounded-xl p-0 overflow-hidden bg-white">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-2 top-2 rounded-full bg-white/80 hover:bg-white z-10"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="w-full max-h-[60vh] overflow-hidden">
            <img 
              src={currentImage} 
              alt={`${agency.agency_name} - ${agency.project_title || 'Project'}`}
              className="w-full h-full object-contain"
            />
            
            {agency.project_images && agency.project_images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {agency.project_images.map((_, idx) => (
                  <button 
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{agency.agency_name}</DialogTitle>
            {agency.project_title && (
              <DialogDescription className="text-lg font-medium text-neutral-700">
                {agency.project_title}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2">
              {agency.project_description && (
                <p className="text-neutral-600 mb-4">
                  {agency.project_description}
                </p>
              )}
              
              {agency.tags && agency.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {agency.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {agency.project_url && (
                <a 
                  href={agency.project_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  <span>Visit Project</span>
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              )}
            </div>
            
            <div className="border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6">
              <div className="mb-4">
                <h4 className="font-medium text-neutral-500 mb-1">Agency</h4>
                <p className="font-semibold">{agency.agency_name}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-neutral-500 mb-1">Date Added</h4>
                <p>{formatDate(agency.scraped_date)}</p>
              </div>
              
              {agency.project_url && (
                <div className="mb-4">
                  <h4 className="font-medium text-neutral-500 mb-1">Project URL</h4>
                  <a 
                    href={agency.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-words"
                  >
                    {agency.project_url.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              
              <Button className="w-full flex items-center justify-center gap-2">
                <Bookmark className="h-4 w-4" />
                <span>Save Project</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
