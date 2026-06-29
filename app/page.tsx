"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
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

type AppMode = "student" | "admin";

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
  const [mode, setMode] = useState<AppMode>("student");
  const [currentView, setCurrentView] = useState<CurrentView>("home");
  const [activeCourseId, setActiveCourseId] = useState<string>("");

  const toggleMode = () => {
    setMode((prev) => {
      if (prev === "student") {
        setCurrentView("admin-dashboard");
        return "admin";
      } else {
        setCurrentView("home");
        return "student";
      }
    });
  };

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

  if (mode === "admin") {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar
          mode={mode}
          currentView={currentView}
          onNavigate={(view) => navigate(view)}
          onToggleMode={toggleMode}
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
        mode={mode}
        currentView={currentView}
        onNavigate={(view) => navigate(view)}
        onToggleMode={toggleMode}
      />
      <main className="flex-1">
        {renderStudentContent()}
      </main>
      <WhatsAppButton />
    </div>
  );
}
