import { Search, SlidersHorizontal } from "lucide-react";

const ProductFilters = ({
  search,
  category,
  sortField,
  categories = [],
  onSearchChange,
  onCategoryChange,
  onSortChange,
}) => {
  const normalizedCategories = Array.isArray(categories)
    ? categories
        .map((item) => {
          if (typeof item === "string") {
            return item.trim();
          }

          if (item && typeof item === "object") {
            return String(item.name || item.value || "").trim();
          }

          return String(item || "").trim();
        })
        .filter(Boolean)
    : [];

  const categoryOptions =
    normalizedCategories.length > 0
      ? [...new Set(normalizedCategories)]
      : [
          "beauty",
          "fragrances",
          "furniture",
          "groceries",
          "laptops",
          "mens-shirts",
          "mens-shoes",
          "mens-watches",
          "mobile-accessories",
          "motorcycle",
          "skin-care",
          "smartphones",
          "sports-accessories",
          "sunglasses",
          "tablets",
          "tops",
          "vehicle",
          "womens-bags",
          "womens-dresses",
          "womens-jewellery",
          "womens-shoes",
          "womens-watches",
        ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex-1">
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            disabled={Boolean(search)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">All Categories</option>

            {categoryOptions.map((item) => (
              <option key={item} value={item}>
                {item
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 items-center gap-2">
          <SlidersHorizontal
            size={18}
            className="hidden text-slate-400 sm:block"
          />

          <select
            value={sortField}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Sort By</option>

            <option value="title">Title</option>

            <option value="price">Price</option>

            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {search && (
        <p className="mt-3 text-xs text-slate-500">
          Category filtering is disabled while searching.
        </p>
      )}
    </div>
  );
};

export default ProductFilters;
