const UPDATED_PRODUCTS_KEY = "updatedProducts";
const DELETED_PRODUCTS_KEY = "deletedProducts";
const CREATED_PRODUCTS_KEY = "createdProducts";

// ====================
// Updated Products
// ====================

export const getUpdatedProducts = () => {
  return JSON.parse(localStorage.getItem(UPDATED_PRODUCTS_KEY) || "{}");
};

export const getUpdatedProduct = (id) => {
  const products = getUpdatedProducts();

  return products[id] || null;
};

export const saveUpdatedProduct = (product) => {
  const products = getUpdatedProducts();

  products[product.id] = product;

  localStorage.setItem(UPDATED_PRODUCTS_KEY, JSON.stringify(products));
};

// ====================
// Deleted Products
// ====================

export const getDeletedProducts = () => {
  return JSON.parse(localStorage.getItem(DELETED_PRODUCTS_KEY) || "[]");
};

export const isProductDeleted = (id) => {
  const deletedProducts = getDeletedProducts();

  return deletedProducts.includes(Number(id));
};

export const saveDeletedProduct = (id) => {
  const deletedProducts = getDeletedProducts();

  const productId = Number(id);

  if (!deletedProducts.includes(productId)) {
    deletedProducts.push(productId);
  }

  localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deletedProducts));
};

// ====================
// Created Products
// ====================

export const getAllCreatedProducts = () => {
  return JSON.parse(localStorage.getItem(CREATED_PRODUCTS_KEY) || "[]");
};

export const getCreatedProducts = () => {
  const createdProducts = getAllCreatedProducts();
  const deletedProducts = getDeletedProducts();

  return createdProducts.filter(
    (product) => !deletedProducts.includes(Number(product.id)),
  );
};

export const saveCreatedProduct = (product) => {
  const createdProducts = getAllCreatedProducts();

  createdProducts.push(product);

  localStorage.setItem(CREATED_PRODUCTS_KEY, JSON.stringify(createdProducts));
};

export const updateCreatedProduct = (productId, updatedData) => {
  const createdProducts = getAllCreatedProducts();

  const updatedProducts = createdProducts.map((product) => {
    if (Number(product.id) === Number(productId)) {
      return {
        ...product,
        ...updatedData,
        id: product.id,
      };
    }

    return product;
  });

  localStorage.setItem(CREATED_PRODUCTS_KEY, JSON.stringify(updatedProducts));
};
