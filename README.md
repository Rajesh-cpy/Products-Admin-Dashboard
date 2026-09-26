Product Admin Dashboard

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![DummyJSON](https://img.shields.io/badge/API-DummyJSON-111827?logo=json&logoColor=white)](https://dummyjson.com/)

A React and Vite product dashboard for managing a product catalog with authentication, search, filtering, sorting, pagination, and CRUD workflow.

Overview

This app lets an admin:

- sign in with the DummyJSON auth API
- browse a paginated product list
- search products by keyword
- filter by category
- sort by title, price, or rating
- open product details
- add, edit, and delete products

The app keeps created, updated, and deleted items in local storage so changes remain visible after refresh.

Tech stack

- React 19
- Vite 8
- React Router
- Axios
- Tailwind CSS
- Lucide React

Project structure

```text
src/
├── App.jsx
├── components/
│   ├── Header.jsx
│   ├── Pagination.jsx
│   ├── ProductCard.jsx
│   ├── ProductFilters.jsx
│   ├── ProductForm.jsx
│   ├── ProductTable.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── AddProduct.jsx
│   ├── EditProduct.jsx
│   ├── Login.jsx
│   ├── ProductDetails.jsx
│   └── Products.jsx
├── services/
│   ├── api.js
│   ├── authApi.js
│   ├── productApi.js
│   └── productStorage.js
├── index.css
├── main.jsx
```

Features

Authentication

- login form powered by DummyJSON
- token stored in local storage
- protected routes redirect unauthenticated users
- logout clears session data

Product listing

- page size selection of 10, 20, and 50
- previous and next pagination controls
- search by keyword from URL state
- category filtering
- sorting by title, price, and rating
- debounced product fetches while typing

Product management

- add product form with validation
- edit product form
- delete with confirmation
- local persistence for simulated CRUD behavior

User experience

- responsive layout for mobile and desktop
- loading and error states
- clean dashboard styling with Tailwind
- clear interactive states and cursor feedback

DummyJSON integration

The app uses the public DummyJSON endpoints:

- Auth: /auth/login
- Products: /products
- Search: /products/search
- Categories: /products/categories
- Category listing: /products/category/:category
- Product details: /products/:id
- Create, update, and delete: /products/add and /products/:id

Because DummyJSON simulates CRUD in the browser, this app stores local changes with localStorage to preserve the experience after refresh.

Run locally

Requirements

- Node.js 18+
- npm or yarn

Installation
npm install

Development
npm run dev

Production build
npm run build

Preview build
npm run preview

Credentials

Use the sample DummyJSON credentials below:

- username: emilys
- password: emilyspass

Scripts

- npm run dev
- npm run build
- npm run lint
- npm run preview

Notes

This project is built as a frontend assignment dashboard. It intentionally uses browser-side persistence to simulate real data behavior without a backend.

Production readiness

This project is structured for a clean frontend workflow and can be extended to a real backend service when needed. The next production step would be replacing localStorage persistence with a secure API and database layer.

Live URL: https://product-admins-dashboard.netlify.app/

Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run lint and build checks
5. Open a pull request with a clear summary

License

This project is intended for educational and assignment use.
