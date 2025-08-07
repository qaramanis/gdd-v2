import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GamesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function GamesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: GamesPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex gap-1">
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          // Show first page, last page, current page, and pages around current
          const shouldShow =
            pageNum === 1 ||
            pageNum === totalPages ||
            Math.abs(pageNum - currentPage) <= 1;

          if (!shouldShow && pageNum === 2 && currentPage > 3) {
            return (
              <span key={pageNum} className="px-2">
                ...
              </span>
            );
          }
          if (
            !shouldShow &&
            pageNum === totalPages - 1 &&
            currentPage < totalPages - 2
          ) {
            return (
              <span key={pageNum} className="px-2">
                ...
              </span>
            );
          }
          if (!shouldShow) return null;

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="min-w-[40px]"
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
