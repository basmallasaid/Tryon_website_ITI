import { Suspense, useEffect, useRef } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router";

// Contexts
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WardrobeProvider } from "./context/WardrobeContext";
import { RecommendationProvider } from "./context/RecommendationContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";

// Hooks
import { useOnlineStatus } from "./hooks/useOnlineStatus";

// Pages
import Home from "./pages/home/Home";
import GoogleCallback from "./pages/Auth/GoogleCallback";
import TryOn from "./pages/tryOn/TryOn";
import StoresPage from "./pages/store/StoresPage";
import Recycle from "./pages/recycle/Recycle";
import Matching from "./pages/matching/Matching";
import AboutRecycle from "./pages/aboutRecycle/AboutRecycle";
import AboutTryon from "./pages/aboutTryOn/AboutTryon";
import About from "./pages/about/About";
import PricingPage from "./pages/pricing/PricingPage";
import AvatarGeneration from "./pages/avatar/AvatarGeneration";
import EditProfilePage from "./pages/profile/EditProfilePage";
import ContactUs from "./pages/contactUs/ContactUs";
import Fav from "./pages/fav/Fav";
import WardrobePage from "./pages/wardrobe/WardrobePage";
import RecommendationsPage from "./pages/recommendations/RecommendationsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

// Components & Layouts
import Layout from "./pages/Layout";
import EditItemWardrobe from "./components/wardrobe/EditItemWardrobe";
import NotFound from "./pages/NotFound/NotFound";
import PWAUpdatePrompt from "./components/PWAUpdatePrompt";
import { CircularProgress, Box } from "@mui/material";

// Loading Component
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      bgcolor: "var(--background)",
    }}
  >
    <CircularProgress sx={{ color: "var(--primary)" }} />
  </Box>
);

// Guards
function AdminLogoutWatcher() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const prevUser = useRef(user);

  useEffect(() => {
    if (prevUser.current && !user) {
      navigate("/login", { replace: true });
    }
    prevUser.current = user;
  }, [user, navigate]);

  return null;
}

function AdminGuard() {
  const { user } = useAuth();
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return (
    <>
      <AdminLogoutWatcher />
      <Outlet />
    </>
  );
}

function LogoutWatcher() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const prevUser = useRef(user);

  useEffect(() => {
    if (prevUser.current && !user) {
      navigate("/login", { replace: true });
    }
    prevUser.current = user;
  }, [user, navigate]);

  return null;
}

function UserGuard() {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  if (auth?.role === "admin") return <Navigate to="/admin" replace />;
  return (
    <>
      <LogoutWatcher />
      <Outlet />
    </>
  );
}

function AuthGuard() {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const isOnline = useOnlineStatus();

  if (!isOnline) return <Outlet />;

  if (!auth && isOnline) return <Navigate to="/login" replace />;

  return <Outlet />;
}

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <UserGuard />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          {
            path: "login",
            element: <Navigate to="/" replace state={{ openAuth: "login" }} />,
          },
          { path: "about-tryon", element: <AboutTryon /> },
          { path: "about-recycle", element: <AboutRecycle /> },
          { path: "about", element: <About /> },
          { path: "contact-us", element: <ContactUs /> },
          { path: "auth/callback", element: <GoogleCallback /> },
          {
            element: <AuthGuard />,
            children: [
              { path: "tryOn", element: <TryOn /> },
              { path: "pricing", element: <PricingPage /> },
              { path: "stores", element: <StoresPage /> },
              { path: "avatar", element: <AvatarGeneration /> },
              { path: "matching", element: <Matching /> },
              { path: "recycle", element: <Recycle /> },
              { path: "editprofile", element: <EditProfilePage /> },
              { path: "favorites", element: <Fav /> },
              { path: "wardrobe", element: <WardrobePage /> },
              { path: "wardrobe/edit/:id", element: <EditItemWardrobe /> },
              { path: "recommendations", element: <RecommendationsPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminGuard />,
    children: [{ index: true, element: <AdminDashboardPage /> }],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function AppContent() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
      <PWAUpdatePrompt />
    </Suspense>
  );
}

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WardrobeProvider>
          <RecommendationProvider>
            <FavoritesProvider>
              <AppContent />
            </FavoritesProvider>
          </RecommendationProvider>
        </WardrobeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
