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
import ResourcesPage from "@/components/resources/ResourcesPage";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminCourses from "@/components/admin/AdminCourses";
import AdminModules from "@/components/admin/AdminModules";
import AdminStudents from "@/components/admin/AdminStudents";
import AdminPurchases from "@/components/admin/AdminPurchases";
import AdminTasks from "@/components/admin/AdminTasks";
import AdminAccess from "@/components/admin/AdminAccess";
import AdminAppointments from "@/components/admin/AdminAppointments";
import AdminProfessionals from "@/components/admin/AdminProfessionals";
import AdminAppointmentAccess from "@/components/admin/AdminAppointmentAccess";
import AdminReviews from "@/components/admin/AdminReviews";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import AdminResources from "@/components/admin/AdminResources";
import AdminContactMessages from "@/components/admin/AdminContactMessages";
import AdminSettings from "@/components/admin/AdminSettings";

type StudentView = "home" | "courses" | "course" | "dashboard" | "contact" | "resources";
type AdminView =
  | "admin-dashboard"
  | "admin-courses"
  | "admin-modules"
  | "admin-students"
  | "admin-purchases"
  | "admin-tasks"
  | "admin-access"
  | "admin-appointments"
  | "admin-professionals"
  | "admin-appointment-access"
  | "admin-reviews"
  | "admin-testimonials"
  | "admin-resources"
  | "admin-contact"
  | "admin-settings";

type CurrentView = StudentView | AdminView;

type PaymentReturnStatus = "success" | "pending" | "failure";

const paymentReturnCopy: Record<PaymentReturnStatus, { tone: string; message: string }> = {
  success: {
    tone: "bg-green-50 border-green-200 text-green-700",
    message: "¡Pago recibido! En unos segundos se activará tu acceso — revisa tu panel.",
  },
  pending: {
    tone: "bg-yellow-50 border-yellow-200 text-yellow-700",
    message: "Tu pago está en proceso. Te avisaremos en cuanto Mercado Pago lo confirme.",
  },
  failure: {
    tone: "bg-red-50 border-red-200 text-red-700",
    message: "No se pudo completar el pago. Puedes intentarlo de nuevo cuando quieras.",
  },
};

function PaymentReturnBanner() {
  const [status, setStatus] = useState<PaymentReturnStatus | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (payment === "success" || payment === "pending" || payment === "failure") {
      setStatus(payment);
      params.delete("payment");
      const rest = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (rest ? `?${rest}` : ""));
    }
  }, []);

  if (!status) return null;
  const copy = paymentReturnCopy[status];
  return (
    <div className={`px-4 py-3 text-sm text-center border-b ${copy.tone}`}>
      {copy.message}
      <button onClick={() => setStatus(null)} className="ml-3 underline underline-offset-2">
        Cerrar
      </button>
    </div>
  );
}

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
      case "resources":
        return <ResourcesPage />;
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
      case "admin-appointments": return <AdminAppointments />;
      case "admin-professionals": return <AdminProfessionals />;
      case "admin-appointment-access": return <AdminAppointmentAccess />;
      case "admin-reviews": return <AdminReviews />;
      case "admin-testimonials": return <AdminTestimonials />;
      case "admin-resources": return <AdminResources />;
      case "admin-contact": return <AdminContactMessages />;
      case "admin-settings": return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  };

  if (isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <PaymentReturnBanner />
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
      <PaymentReturnBanner />
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
