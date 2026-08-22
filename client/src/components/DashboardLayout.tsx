import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { BookOpenCheck, CircleAlert, CreditCard, GraduationCap, History, LayoutDashboard, LogOut, MessageCircleQuestion, PanelLeft, TimerReset } from "lucide-react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ExamMark } from "./ExamMark";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpenCheck, label: "Practice", path: "/practice" },
  { icon: TimerReset, label: "Practice Mock", path: "/mock-exam" },
  { icon: History, label: "Mock history", path: "/mock-history" },
  { icon: GraduationCap, label: "Course direction", path: "/course-direction" },
  { icon: MessageCircleQuestion, label: "Tutor", path: "/tutor" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, user, error, refresh } = useAuth();
  if (loading) return <DashboardLayoutSkeleton />;
  if (error) return <div className="grid min-h-screen place-items-center bg-[#F4F7F8] p-6"><section className="max-w-md rounded-3xl border border-[#E8C8C5] bg-white p-6 text-center shadow-sm"><CircleAlert className="mx-auto h-8 w-8 text-[#B5473A]" strokeWidth={1.8} /><h1 className="mt-4 font-display text-2xl font-bold text-[#163A5F]">We could not open your study space.</h1><p className="mt-2 text-sm leading-6 text-[#607082]">Your account has not been changed. Please check your connection and try again.</p><Button onClick={() => refresh()} className="mt-6 h-11 rounded-xl bg-[#245EA8] text-white hover:bg-[#1D4F8F]">Try again</Button></section></div>;
  if (!user) return <div className="grid min-h-screen place-items-center bg-[#F4F7F8] p-6"><div className="max-w-sm text-center"><ExamMark /><h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-[#163A5F]">Your study space is waiting.</h1><p className="mt-3 text-sm leading-6 text-[#607082]">Sign in to keep your practice, study target, and billing access in one place.</p><Button onClick={() => startLogin()} className="mt-6 h-11 w-full rounded-xl bg-[#245EA8] text-white hover:bg-[#1D4F8F]">Sign in to ExamPilot</Button></div></div>;
  return <SidebarProvider><StudentShell>{children}</StudentShell></SidebarProvider>;
}

function StudentShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const active = menuItems.find(item => item.path === location)?.label ?? "ExamPilot";
  const displayName = user?.name?.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "").trim() || "ExamPilot learner";
  return <><Sidebar collapsible="offcanvas" className="border-r border-[#204A74] bg-[#163A5F] text-white"><SidebarHeader className="p-5"><ExamMark inverted /></SidebarHeader><SidebarContent className="px-3"><p className="px-2 pb-2 pt-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#AFC6DD]">Study space</p><SidebarMenu>{menuItems.map(item => <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={location === item.path} onClick={() => setLocation(item.path)} className="h-11 rounded-xl text-[#D7E4EF] hover:bg-white/10 hover:text-white data-[active=true]:bg-[#E8F0FA] data-[active=true]:text-[#163A5F]"><item.icon className="h-4 w-4" strokeWidth={1.8} /><span className="font-medium">{item.label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarContent><SidebarFooter className="m-3 rounded-2xl border border-white/10 bg-white/5 p-3"><div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarFallback className="bg-[#245EA8] text-xs font-bold text-white">{displayName.charAt(0).toUpperCase() || "E"}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{displayName}</p><p className="truncate text-xs text-[#C9D8E6]">{user?.email || "Study account"}</p></div></div><button onClick={logout} className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-[#D7E4EF] hover:bg-white/10 hover:text-white"><LogOut className="h-3.5 w-3.5" strokeWidth={1.8} /> Sign out</button></SidebarFooter></Sidebar><SidebarInset className="bg-[#F4F7F8]"><header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#DDE5EA] bg-[#F4F7F8]/90 px-4 backdrop-blur sm:px-6"><SidebarTrigger className="rounded-lg text-[#46586B] hover:bg-[#E8F0FA]"><PanelLeft className="h-4 w-4" strokeWidth={1.8} /></SidebarTrigger><p className="font-display text-lg font-bold tracking-tight text-[#163A5F]">{active}</p></header><main className="p-4 sm:p-6 lg:p-8">{children}</main></SidebarInset></>;
}
