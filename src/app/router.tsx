import { createHashRouter } from 'react-router-dom';

import { AppLayout } from '../components/layout/AppLayout/AppLayout';

import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { CartPage } from '../pages/CartPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProductPage } from '../pages/ProductPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'catalog',
        element: <CatalogPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
      {
        path: 'products/:slug',
        element: <ProductPage />,
      },
    ],
  },
]);
