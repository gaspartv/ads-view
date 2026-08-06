"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-2 mt-8 mb-4">
      {currentPage > 1 ? (
        <Link href={createPageURL(currentPage - 1)} className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {visiblePages.map((page, index) => {
        if (page === "...") {
          return (
            <Button
              key={`ellipsis-${index}`}
              variant="ghost"
              size="icon"
              disabled
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          );
        }

        const isCurrentPage = page === currentPage;

        return isCurrentPage ? (
          <Button key={page} variant="default" size="icon" className="pointer-events-none">
            {page}
          </Button>
        ) : (
          <Link key={page} href={createPageURL(page)} className={buttonVariants({ variant: "outline", size: "icon" })}>
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages ? (
        <Link href={createPageURL(currentPage + 1)} className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
