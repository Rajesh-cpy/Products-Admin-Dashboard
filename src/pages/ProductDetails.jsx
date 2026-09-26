import { useEffect, useState } from "react";
import { ArrowLeft, Edit, Trash2, Star, Package } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";

import { getProductById, deleteProduct } from "../services/productApi";

import {
  getCreatedProducts,
  getUpdatedProduct,
  isProductDeleted,
  saveDeletedProduct,
} from "../services/productStorage";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        // Check if product was deleted
        if (isProductDeleted(id)) {
          setError("This product has been deleted.");

          return;
        }

        // Check locally created product
        const createdProducts = getCreatedProducts();

        const createdProduct = createdProducts.find(
          (item) => Number(item.id) === Number(id),
        );

        if (createdProduct) {
          setProduct(createdProduct);
          return;
        }

        // Check locally updated product
        const updatedProduct = getUpdatedProduct(id);

        if (updatedProduct) {
          setProduct(updatedProduct);
          return;
        }

        // Fetch from API
        const data = await getProductById(id);

        setProduct(data);
      } catch (error) {
        console.error(error);

        setError("Product not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!product || deleting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const createdProducts = getCreatedProducts();

      const isCreatedProduct = createdProducts.some(
        (item) => Number(item.id) === Number(product.id),
      );

      // Delete from DummyJSON only
      // for API products
      if (!isCreatedProduct) {
        await deleteProduct(product.id);
      }

      // Persist deletion locally
      saveDeletedProduct(product.id);

      navigate("/products");
    } catch (error) {
      console.error(error);

      setError("Failed to delete product. Please try again.");

      setDeleting(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="px-4 py-12">
          <div className="mx-auto flex max-w-5xl justify-center">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

              <p className="mt-4 text-sm text-slate-500">Loading product...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Package size={26} />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Product unavailable
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error || "The requested product could not be found."}
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 flex mx-auto cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <ArrowLeft size={17} />
              Back to Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // Product Details
  // =========================

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Back */}
          <button
            onClick={() => navigate("/products")}
            className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-2">
              {/* Image */}
              <div className="flex min-h-[360px] items-center justify-center bg-slate-50 p-8">
                <img
                  src={product.thumbnail || product.images?.[0]}
                  alt={product.title}
                  className="max-h-[360px] w-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium capitalize text-indigo-600">
                      {product.category}
                    </span>

                    <h1 className="mt-4 text-2xl font-bold text-slate-900">
                      {product.title}
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                      Product ID: {product.id}
                    </p>
                  </div>
                </div>

                <p className="mt-6 leading-7 text-slate-600">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mt-8">
                  <p className="text-sm text-slate-500">Price</p>

                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    ${product.price}
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Rating</p>

                    <div className="mt-2 flex items-center gap-2">
                      <Star
                        size={18}
                        className="fill-amber-400 text-amber-400"
                      />

                      <span className="font-semibold text-slate-900">
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Stock</p>

                    <p
                      className={`mt-2 font-semibold ${
                        product.stock > 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {product.stock}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Brand</p>

                    <p className="mt-2 truncate font-semibold text-slate-700">
                      {product.brand || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Discount</p>

                    <p className="mt-2 font-semibold text-slate-700">
                      {product.discountPercentage
                        ? `${product.discountPercentage}%`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    <Edit size={17} />
                    Edit Product
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={17} />

                    {deleting ? "Deleting..." : "Delete Product"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
