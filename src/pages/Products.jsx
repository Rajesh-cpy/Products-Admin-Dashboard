import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getProductCategories,
  deleteProduct,
} from "../services/productApi";

import {
  getCreatedProducts,
  getAllCreatedProducts,
  getDeletedProducts,
  getUpdatedProducts,
  saveDeletedProduct,
} from "../services/productStorage";

const VALID_PAGE_SIZES = [10, 20, 50];

const VALID_SORT_FIELDS = ["title", "price", "rating"];

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

const Products = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(DEFAULT_PAGE);

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [sortField, setSortField] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [retryCount, setRetryCount] = useState(0);

  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // Read state from URL
  // =========================

  useEffect(() => {
    const urlPage = Number(searchParams.get("page"));

    const urlPageSize = Number(searchParams.get("pageSize"));

    const urlSearch = searchParams.get("search") || "";

    const urlCategory = searchParams.get("category") || "";

    const urlSort = searchParams.get("sort") || "";

    const validPage =
      Number.isInteger(urlPage) && urlPage > 0 ? urlPage : DEFAULT_PAGE;

    const validPageSize = VALID_PAGE_SIZES.includes(urlPageSize)
      ? urlPageSize
      : DEFAULT_PAGE_SIZE;

    const validSort = VALID_SORT_FIELDS.includes(urlSort) ? urlSort : "";

    setPage(validPage);
    setPageSize(validPageSize);
    setSearch(urlSearch);
    setSortField(validSort);

    /*
      Search and category are mutually exclusive.

      If both exist in the URL,
      search takes priority.
    */
    if (urlSearch) {
      setCategory("");
    } else {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  // =========================
  // Update URL
  // =========================

  const updateUrl = ({
    newPage = page,
    newPageSize = pageSize,
    newSearch = search,
    newCategory = category,
    newSortField = sortField,
  }) => {
    const params = new URLSearchParams();

    if (newPage !== DEFAULT_PAGE) {
      params.set("page", String(newPage));
    }

    if (newPageSize !== DEFAULT_PAGE_SIZE) {
      params.set("pageSize", String(newPageSize));
    }

    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    } else if (newCategory) {
      params.set("category", newCategory);
    }

    if (newSortField) {
      params.set("sort", newSortField);
    }

    setSearchParams(params);
  };

  // =========================
  // Fetch products
  // =========================

  useEffect(() => {
    let controller;
    let debounceTimer;

    const fetchCategories = async () => {
      const categoriesController = new AbortController();

      try {
        const data = await getProductCategories(categoriesController.signal);

        setCategories(data || []);
      } catch (error) {
        if (
          axios.isCancel(error) ||
          error.name === "CanceledError" ||
          error.name === "AbortError"
        ) {
          return;
        }

        setCategories([]);
      }
    };

    fetchCategories();

    return () => {
      controller?.abort();
    };
  }, []);

  useEffect(() => {
    let controller;
    let debounceTimer;

    const fetchProducts = async () => {
      controller = new AbortController();

      try {
        setLoading(true);
        setError("");

        const skip = (page - 1) * pageSize;

        let data;

        // =========================
        // Search
        // =========================

        if (search.trim()) {
          data = await searchProducts(
            search.trim(),
            pageSize,
            skip,
            controller.signal,
          );
        }

        // =========================
        // Category
        // =========================
        else if (category) {
          data = await getProductsByCategory(
            category,
            pageSize,
            skip,
            controller.signal,
          );
        }

        // =========================
        // Normal products
        // =========================
        else {
          data = await getProducts(pageSize, skip, controller.signal);
        }

        // =========================
        // Local data
        // =========================

        const createdProducts = getCreatedProducts();

        const deletedProducts = getDeletedProducts();

        const updatedProducts = getUpdatedProducts();

        // =========================
        // Remove deleted products
        // =========================

        let mergedProducts = data.products.filter(
          (product) => !deletedProducts.includes(Number(product.id)),
        );

        // =========================
        // Apply local updates
        // =========================

        mergedProducts = mergedProducts.map(
          (product) => updatedProducts[product.id] || product,
        );

        // =========================
        // Add local created products
        // =========================

        if (page === 1 && !search.trim() && !category) {
          mergedProducts = [...createdProducts, ...mergedProducts];
        }

        // =========================
        // Search local products
        // =========================

        if (search.trim()) {
          const searchValue = search.trim().toLowerCase();

          const matchingCreatedProducts = createdProducts.filter((product) => {
            return (
              product.title?.toLowerCase().includes(searchValue) ||
              product.description?.toLowerCase().includes(searchValue) ||
              product.category?.toLowerCase().includes(searchValue)
            );
          });

          if (page === 1) {
            mergedProducts = [...matchingCreatedProducts, ...mergedProducts];
          }
        }

        // =========================
        // Category local products
        // =========================

        if (category && page === 1) {
          const matchingCreatedProducts = createdProducts.filter(
            (product) => product.category === category,
          );

          mergedProducts = [...matchingCreatedProducts, ...mergedProducts];
        }

        // =========================
        // Sorting
        // =========================

        if (sortField) {
          mergedProducts.sort((a, b) => {
            if (sortField === "title") {
              return a.title.localeCompare(b.title);
            }

            if (sortField === "price") {
              return Number(a.price) - Number(b.price);
            }

            if (sortField === "rating") {
              return Number(a.rating) - Number(b.rating);
            }

            return 0;
          });
        }

        // =========================
        // Calculate total
        // =========================

        const createdCount = createdProducts.length;

        const deletedApiProducts = deletedProducts.filter((deletedId) => {
          return !createdProducts.some(
            (createdProduct) => Number(createdProduct.id) === Number(deletedId),
          );
        }).length;

        let calculatedTotal = Math.max(
          0,
          data.total - deletedApiProducts + createdCount,
        );

        // =========================
        // Search / Category total
        // =========================

        if (search.trim() || category) {
          const matchingCreatedCount = createdProducts.filter((product) => {
            if (search.trim()) {
              const searchValue = search.trim().toLowerCase();

              return (
                product.title?.toLowerCase().includes(searchValue) ||
                product.description?.toLowerCase().includes(searchValue) ||
                product.category?.toLowerCase().includes(searchValue)
              );
            }

            return product.category === category;
          }).length;

          calculatedTotal = Math.max(0, data.total + matchingCreatedCount);
        }

        setProducts(mergedProducts);

        setTotal(calculatedTotal);
      } catch (error) {
        if (
          axios.isCancel(error) ||
          error.name === "CanceledError" ||
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(error);

        setError("Failed to load products. Please try again.");

        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    /*
      500ms debounce.

      This prevents a request for every
      character while typing.
    */
    debounceTimer = setTimeout(fetchProducts, 500);

    return () => {
      clearTimeout(debounceTimer);

      if (controller) {
        controller.abort();
      }
    };
  }, [page, pageSize, search, category, sortField, retryCount]);

  // =========================
  // Search
  // =========================

  const handleSearchChange = (value) => {
    updateUrl({
      newPage: 1,
      newSearch: value,
      newCategory: "",
    });
  };

  // =========================
  // Category
  // =========================

  const handleCategoryChange = (value) => {
    updateUrl({
      newPage: 1,
      newSearch: "",
      newCategory: value,
    });
  };

  // =========================
  // Sort
  // =========================

  const handleSortChange = (value) => {
    updateUrl({
      newPage: 1,
      newSortField: value,
    });
  };

  // =========================
  // Page
  // =========================

  const handlePageChange = (newPage) => {
    if (newPage < 1) {
      return;
    }

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    if (newPage > totalPages) {
      return;
    }

    updateUrl({
      newPage,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // Page size
  // =========================

  const handlePageSizeChange = (newPageSize) => {
    if (!VALID_PAGE_SIZES.includes(newPageSize)) {
      return;
    }

    updateUrl({
      newPage: 1,
      newPageSize,
    });
  };

  // =========================
  // Delete
  // =========================

  const handleDelete = async (product) => {
    /*
      Prevent another delete request
      while one is already running.
    */
    if (deletingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product.id);
      setError("");

      const createdProducts = getAllCreatedProducts();

      const isCreatedProduct = createdProducts.some(
        (item) => Number(item.id) === Number(product.id),
      );

      /*
        DummyJSON DELETE is only
        needed for API products.
      */
      if (!isCreatedProduct) {
        await deleteProduct(product.id);
      }

      /*
        Save deleted ID locally so
        the product remains deleted
        after refresh.
      */
      saveDeletedProduct(product.id);

      /*
        Immediately remove from UI.
      */
      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => Number(item.id) !== Number(product.id),
        ),
      );

      setTotal((currentTotal) => Math.max(0, currentTotal - 1));
    } catch (error) {
      console.error(error);

      setError("Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // Retry
  // =========================

  const handleRetry = () => {
    setRetryCount((current) => current + 1);
  };

  // =========================
  // Render
  // =========================

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Products</h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your product catalog.
              </p>
            </div>

            <button
              onClick={() => navigate("/products/add")}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <ProductFilters
              search={search}
              category={category}
              sortField={sortField}
              categories={categories}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>

              <button
                onClick={handleRetry}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          )}

          {/* Products */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

                  <p className="mt-4 text-sm text-slate-500">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center px-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-slate-900">
                    No products found
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Try changing your search, category, or filters.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block">
                  <ProductTable
                    products={products}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                  />
                </div>

                {/* Mobile cards */}
                <div className="space-y-4 p-4 md:hidden">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onDelete={handleDelete}
                      deletingId={deletingId}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
