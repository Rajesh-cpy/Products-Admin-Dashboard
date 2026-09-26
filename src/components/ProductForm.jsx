import { useEffect, useState } from "react";

const ProductForm = ({
  initialData,
  onSubmit,
  loading,
  submitText = "Add Product",
}) => {
  // ----------------------------------
  // Form State
  // ----------------------------------

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");

  const [stock, setStock] = useState("");

  const [category, setCategory] = useState("");

  const [brand, setBrand] = useState("");

  // ----------------------------------
  // Validation Errors
  // ----------------------------------

  const [errors, setErrors] = useState({});

  // ----------------------------------
  // Load Initial Data
  // ----------------------------------

  useEffect(() => {
    setTitle(initialData?.title || "");

    setDescription(initialData?.description || "");

    setPrice(initialData?.price ?? "");

    setStock(initialData?.stock ?? "");

    setCategory(initialData?.category || "");

    setBrand(initialData?.brand || "");

    setErrors({});
  }, [initialData]);

  // ----------------------------------
  // Validate Form
  // ----------------------------------

  const validateForm = () => {
    const newErrors = {};

    // Title
    if (!title.trim()) {
      newErrors.title = "Product title is required.";
    }

    // Description
    if (!description.trim()) {
      newErrors.description = "Description is required.";
    }

    // Price
    if (price === "") {
      newErrors.price = "Price is required.";
    } else if (Number(price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    // Stock
    if (stock === "") {
      newErrors.stock = "Stock is required.";
    } else if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
      newErrors.stock = "Stock must be a non-negative whole number.";
    }

    // Category
    if (!category.trim()) {
      newErrors.category = "Category is required.";
    }

    // Brand
    if (!brand.trim()) {
      newErrors.brand = "Brand is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ----------------------------------
  // Submit
  // ----------------------------------

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
      Prevent another submission
      while the current request
      is running.
    */
    if (loading) {
      return;
    }

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const productData = {
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      category: category.trim(),
      brand: brand.trim(),
    };

    onSubmit(productData);
  };

  // ----------------------------------
  // Input Error Helper
  // ----------------------------------

  const getInputClass = (field) => {
    return `w-full rounded-lg border px-4 py-2.5 text-sm text-slate-700 outline-none transition ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    }`;
  };

  // ----------------------------------
  // UI
  // ----------------------------------

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* --------------------------------
          Title
      -------------------------------- */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Product Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter product title"
          className={getInputClass("title")}
          disabled={loading}
        />

        {errors.title && (
          <p className="mt-1.5 text-xs text-red-600">{errors.title}</p>
        )}
      </div>

      {/* --------------------------------
          Description
      -------------------------------- */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter product description"
          rows={5}
          className={`${getInputClass("description")} resize-none`}
          disabled={loading}
        />

        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600">{errors.description}</p>
        )}
      </div>

      {/* --------------------------------
          Price + Stock
      -------------------------------- */}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Price */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Price
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="0.00"
            className={getInputClass("price")}
            disabled={loading}
          />

          {errors.price && (
            <p className="mt-1.5 text-xs text-red-600">{errors.price}</p>
          )}
        </div>

        {/* Stock */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Stock
          </label>

          <input
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            placeholder="0"
            className={getInputClass("stock")}
            disabled={loading}
          />

          {errors.stock && (
            <p className="mt-1.5 text-xs text-red-600">{errors.stock}</p>
          )}
        </div>
      </div>

      {/* --------------------------------
          Category + Brand
      -------------------------------- */}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Category */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>

          <input
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="e.g. smartphones"
            className={getInputClass("category")}
            disabled={loading}
          />

          {errors.category && (
            <p className="mt-1.5 text-xs text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Brand */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Brand
          </label>

          <input
            type="text"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            placeholder="Enter brand"
            className={getInputClass("brand")}
            disabled={loading}
          />

          {errors.brand && (
            <p className="mt-1.5 text-xs text-red-600">{errors.brand}</p>
          )}
        </div>
      </div>

      {/* --------------------------------
          Submit
      -------------------------------- */}

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
