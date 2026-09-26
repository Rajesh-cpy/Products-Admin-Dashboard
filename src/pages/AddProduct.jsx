import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import ProductForm from "../components/ProductForm";

import { addProduct } from "../services/productApi";

import { saveCreatedProduct } from "../services/productStorage";

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleAddProduct = async (productData) => {
    try {
      setLoading(true);
      setError("");

      const createdProduct = await addProduct(productData);

      /*
        DummyJSON CRUD is simulated.
        Therefore, we create our own
        local product ID and save the
        product in localStorage.
      */
      const localProduct = {
        ...createdProduct,
        ...productData,
        id: Date.now(),
      };

      saveCreatedProduct(localProduct);

      navigate("/products");
    } catch (error) {
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <button
            onClick={() => navigate("/products")}
            className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Add Product</h1>

              <p className="mt-2 text-sm text-slate-500">
                Add a new product to your catalog.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <ProductForm
              onSubmit={handleAddProduct}
              loading={loading}
              submitText="Add Product"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
