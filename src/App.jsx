// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
import { lazy, Suspense, useMemo, useEffect } from 'react';

import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import AuthPage from "./pages/Auth/AuthPage"
import GoogleCallback from "./pages/Auth/GoogleCallback"
import Home from "./pages/home/Home"
// const FurnitureDetail = lazy(() => import('./pages/FurnitureDetail'));

import TryOn from "./pages/tryOn/TryOn"
import StoresPage from "./pages/store/StoresPage"
import Navbar from "./components/Navbar"
import { CircularProgress, Box } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from "./pages/Layout"
import AdminLayout from "./pages/AdminLayout"
import Dashboard from "./pages/admin/Dashboard"
import Products from "./pages/admin/Products"


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
        { path: 'auth/callback', element: <GoogleCallback /> },
        { path: 'stores', element: <StoresPage /> }
      ]

    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'products', element: <Products /> }

      ]
    }
  ])
  return (
    <Suspense fallback={<LoadingFallback />}>

      <RouterProvider router={router} />
    </Suspense>
  );
}


function App() {

  return (
    <AuthProvider>
      {/* <Navbar />
        <AuthPage /> */}

      <AppContent />
    </AuthProvider>
  )
}

export default App
