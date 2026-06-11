// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
import { lazy, Suspense, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AuthPage from './pages/Auth/AuthPage';
import GoogleCallback from './pages/Auth/GoogleCallback';
import Home from './pages/home/Home';
// const FurnitureDetail = lazy(() => import('./pages/FurnitureDetail'));

import TryOn from './pages/tryOn/TryOn';
import StoresPage from './pages/store/StoresPage';
import Navbar from './components/Navbar';
import Recycle from './pages/recycle/Recycle';
import AboutRecycle from './pages/aboutRecycle/AboutRecycle';
import AboutTryon from './pages/aboutTryOn/AboutTryon';
import PricingPage from './pages/pricing/PricingPage';

import { CircularProgress, Box } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './pages/Layout';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import EditProfilePage from './pages/profile/EditProfilePage';
import ContactUs from './pages/contactUs/ContactUs';

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: '#0A0E17',
    }}
  >
    <CircularProgress sx={{ color: '#00E5FF' }} />
  </Box>
);

function AppContent() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'tryOn', element: <TryOn /> },
        { path: 'about-tryon', element: <AboutTryon /> },
        { path: 'pricing', element: <PricingPage /> },
        { path: 'auth/callback', element: <GoogleCallback /> },
        { path: 'stores', element: <StoresPage /> },
        { path: 'recycle', element: <Recycle /> },
        { path: 'about-recycle', element: <AboutRecycle /> },
        { path: 'contact-us', element: <ContactUs /> },
        {path:'editprofile',element:<EditProfilePage/>},
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'products', element: <Products /> },
      ],
    },
  ]);
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  return (
    <AuthProvider>
      {/* <Navbar />
        <AuthPage /> */}

      <AppContent />
    </AuthProvider>
  );
}

export default App;
