import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;

  const endItem = Math.min(page * pageSize, total);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-slate-500">
        {total === 0 ? (
          "No products"
        ) : (
          <>
            Showing{" "}
            <span className="font-medium text-slate-700">
              {startItem}–{endItem}
            </span>{" "}
            of <span className="font-medium text-slate-700">{total}</span>
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="mr-2 flex items-center gap-2">
          <span className="text-sm text-slate-500">Page size:</span>

          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value={10}>10</option>

            <option value={20}>20</option>

            <option value={50}>50</option>
          </select>
        </div>

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="flex h-9 cursor-pointer items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />

          <span className="hidden sm:inline">Previous</span>
        </button>

        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={pageNumber === page ? "page" : undefined}
              className={`h-9 min-w-9 cursor-pointer rounded-lg px-3 text-sm font-medium transition ${
                pageNumber === page
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className="flex h-9 cursor-pointer items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Next</span>

          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
