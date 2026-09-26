import { Eye, Trash2, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onDelete, deletingId }) => {
  const navigate = useNavigate();

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Product header */}
      <div className="flex items-center gap-4 border-b border-slate-100 p-4">
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
        />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-slate-900">
            {product.title}
          </h2>

          <p className="mt-1 text-xs text-slate-400">ID: {product.id}</p>

          <span className="mt-2 inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium capitalize text-indigo-600">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product details */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Price */}
        <div>
          <p className="text-xs text-slate-400">Price</p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            ${product.price}
          </p>
        </div>

        {/* Rating */}
        <div>
          <p className="text-xs text-slate-400">Rating</p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            ⭐ {product.rating}
          </p>
        </div>

        {/* Stock */}
        <div>
          <p className="text-xs text-slate-400">Stock</p>

          <p
            className={`mt-1 text-sm font-semibold ${
              product.stock > 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {product.stock}
          </p>
        </div>

        {/* Brand */}
        <div>
          <p className="text-xs text-slate-400">Brand</p>

          <p className="mt-1 truncate text-sm font-medium text-slate-700">
            {product.brand || "N/A"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-slate-100 p-4">
        {/* View */}
        <button
          onClick={() => navigate(`/products/${product.id}`)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
        >
          <Eye size={16} />
          View Product
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(product)}
          disabled={deletingId === product.id}
          title="Delete Product"
          aria-label={`Delete ${product.title}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deletingId === product.id ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
