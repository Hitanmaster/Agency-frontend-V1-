import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex justify-center mb-4 text-accent">
              <AlertCircle className="h-16 w-16" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
            
            <p className="text-neutral-600 mb-6">
              {message}
            </p>
            
            <Button onClick={onRetry} className="w-full sm:w-auto">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
