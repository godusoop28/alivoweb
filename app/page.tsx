"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/lib/auth/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import HomePage from "@/components/home/HomePage";
import CoursesPage from "@/components/courses/CoursesPage";
import CourseViewer from "@/components/course/CourseViewer";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import ContactPage from "@/components/contact/ContactPage";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminCourses from "@/components/admin/AdminCourses";
import AdminModules from "@/components/admin/AdminModules";
import AdminStudents from "@/components/admin/AdminStudents";
import AdminPurchases from "@/components/admin/AdminPurchases";
import AdminTasks from "@/components/admin/AdminTasks";
import AdminAccess from "@/components/admin/AdminAccess";
import AdminSettings from "@/components/admin/AdminSettings";

type StudentView = "home" | "courses" | "course" | "dashboard" | "contact";
type AdminView =
  | "admin-dashboard"
  | "admin-courses"
  | "admin-modules"
  | "admin-students"
  | "admin-purchases"
  | "admin-tasks"
  | "admin-access"
  | "admin-settings";

type CurrentView = StudentView | AdminView;

export default function App() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [currentView, setCurrentView] = useState<CurrentView>("home");
  const [activeCourseId, setActiveCourseId] = useState<string>("");

  // Sync the visible panel with the logged-in user's role. Admins land on
  // the admin dashboard, students on their course dashboard; logging out
  // always drops back to the public landing page.
  useEffect(() => {
    if (loading) return;
    if (user?.role === "ADMIN") {
      setCurrentView("admin-dashboard");
    } else if (user?.role === "STUDENT") {
      setCurrentView("dashboard");
    } else {
      setCurrentView("home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loading]);

  // Admin views require an ADMIN session and student-only views require any
  // session; without the right one, bounce to the public landing page
  // instead of rendering a panel the user isn't authorized to see.
  useEffect(() => {
    if (loading) return;
    const isAdminView = currentView.startsWith("admin-");
    if (isAdminView && !isAdmin) {
      setCurrentView("home");
    } else if (currentView === "dashboard" && !user) {
      setCurrentView("home");
    }
  }, [currentView, user, isAdmin, loading]);

  const navigate = (view: CurrentView, courseId?: string) => {
    if (view === "course" && courseId) {
      setActiveCourseId(courseId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderStudentContent = () => {
    switch (currentView) {
      case "home":
        return (
          <HomePage
            onNavigate={(view, courseId) => navigate(view as CurrentView, courseId)}
          />
        );
      case "courses":
        return (
          <CoursesPage
            onOpenCourse={(id) => navigate("course", id)}
          />
        );
      case "course":
        return (
          <CourseViewer
            courseId={activeCourseId}
            onBack={() => navigate("courses")}
          />
        );
      case "dashboard":
        return (
          <StudentDashboard
            onOpenCourse={(id) => navigate("course", id)}
          />
        );
      case "contact":
        return <ContactPage />;
      default:
        return null;
    }
  };

  const renderAdminContent = () => {
    switch (currentView) {
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-courses": return <AdminCourses />;
      case "admin-modules": return <AdminModules />;
      case "admin-students": return <AdminStudents />;
      case "admin-purchases": return <AdminPurchases />;
      case "admin-tasks": return <AdminTasks />;
      case "admin-access": return <AdminAccess />;
      case "admin-settings": return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  };

  if (isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar
          currentView={currentView}
          onNavigate={(view) => navigate(view)}
        />
        <AdminLayout
          currentView={currentView as AdminView}
          onNavigate={(view) => navigate(view)}
        >
          {renderAdminContent()}
        </AdminLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentView={currentView}
        onNavigate={(view) => navigate(view)}
      />
      <main className="flex-1">
        {renderStudentContent()}
      </main>
      {currentView !== "course" && <Footer />}
      <WhatsAppButton />
    </div>
  );
}
