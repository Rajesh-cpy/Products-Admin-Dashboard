import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import ProductForm from "../components/ProductForm";

import { getProductById, updateProduct } from "../services/productApi";

import {
  getCreatedProducts,
  getUpdatedProduct,
  saveUpdatedProduct,
  updateCreatedProduct,
} from "../services/productStorage";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        // Check locally created products first
        const createdProducts = getCreatedProducts();

        const localCreatedProduct = createdProducts.find(
          (item) => Number(item.id) === Number(id),
        );

        if (localCreatedProduct) {
          setProduct(localCreatedProduct);
          return;
        }

        // Check locally updated product
        const updatedProduct = getUpdatedProduct(id);

        if (updatedProduct) {
          setProduct(updatedProduct);
          return;
        }

        // Fetch product from DummyJSON
        const data = await getProductById(id);

        setProduct(data);
      } catch (error) {
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleUpdate = async (productData) => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const createdProducts = getCreatedProducts();

      const isCreatedProduct = createdProducts.some(
        (item) => Number(item.id) === Number(id),
      );

      // =========================
      // Locally created product
      // =========================

      if (isCreatedProduct) {
        updateCreatedProduct(id, productData);

        const updatedProduct = {
          ...product,
          ...productData,
          id: product.id,
        };

        saveUpdatedProduct(updatedProduct);

        navigate(`/products/${id}`);

        return;
      }

      // =========================
      // DummyJSON product
      // =========================

      const updatedProduct = await updateProduct(id, productData);

      /*
        DummyJSON CRUD is simulated.

        Therefore we save the updated
        product locally so the UI keeps
        the change after refresh.
      */
      const localProduct = {
        ...product,
        ...updatedProduct,
        ...productData,
        id: product.id,
      };

      saveUpdatedProduct(localProduct);

      navigate(`/products/${id}`);
    } catch (error) {
      setError("Failed to update product. Please try again.");
    } finally {
      setSaving(false);
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
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm text-slate-500">Loading product...</p>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error && !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="px-4 py-12">
          <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <h1 className="text-lg font-semibold text-red-700">
              Unable to load product
            </h1>

            <p className="mt-2 text-sm text-red-600">{error}</p>

            <button
              onClick={() => navigate("/products")}
              className="mt-5 cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Back to Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // Form
  // =========================

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <button
            onClick={() => navigate(`/products/${id}`)}
            className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Product
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">
                Edit Product
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Update the product information below.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <ProductForm
              initialData={product}
              onSubmit={handleUpdate}
              loading={saving}
              submitText="Save Changes"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;
