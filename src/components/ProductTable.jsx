import { Eye, Trash2, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductTable = ({ products, onDelete, deletingId }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Product
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Price
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Rating
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Stock
            </th>

            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {products.map((product) => (
            <tr key={product.id} className="transition hover:bg-slate-50">
              {/* Product */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.title}
                    className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                  />

                  <div className="min-w-0">
                    <p className="max-w-xs truncate text-sm font-semibold text-slate-900">
                      {product.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      ID: {product.id}
                    </p>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-6 py-4">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium capitalize text-indigo-600">
                  {product.category}
                </span>
              </td>

              {/* Price */}
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                ${product.price}
              </td>

              {/* Rating */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-1 text-sm text-slate-700">
                  <span aria-hidden="true">⭐</span>

                  <span>{product.rating}</span>
                </div>
              </td>

              {/* Stock */}
              <td className="px-6 py-4">
                <span
                  className={`text-sm font-medium ${
                    product.stock > 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {product.stock}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-3">
                  {/* View */}
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    title="View Product"
                    className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
                  >
                    <Eye size={17} />
                    View
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(product)}
                    disabled={deletingId === product.id}
                    title="Delete Product"
                    aria-label={`Delete ${product.title}`}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === product.id ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
