import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, Bookmark, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const isMobile = useIsMobile();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Agencies", href: "#" },
    { name: "Collections", href: "#" },
    { name: "About", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="font-bold text-2xl">
              <span className="text-primary">Agency</span>
              <span className="text-accent">Hub</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map(link => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className="font-medium text-neutral-700 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isMobile && (
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72">
                <Input
                  type="text"
                  placeholder="Search agencies..."
                  className="pr-10"
                  value={searchValue}
                  onChange={handleSearchChange}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0"
                >
                  <Search className="h-4 w-4 text-neutral-400" />
                </Button>
              </form>
            )}
            
            {isMobile && (
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => {
                // Show search interface on mobile
              }}>
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Bookmarks">
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-6 mt-6">
                  {navLinks.map(link => (
                    <a 
                      key={link.name}
                      href={link.href} 
                      className="text-xl font-medium hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
