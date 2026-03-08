import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AboutPage } from "./pages/AboutPage";
import { ApplicationPage } from "./pages/ApplicationPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { CoursesPage } from "./pages/CoursesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FreeLearningPage } from "./pages/FreeLearningPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";

function PublicRoutes() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/apply" element={<ApplicationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/free-learning" element={<FreeLearningPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
