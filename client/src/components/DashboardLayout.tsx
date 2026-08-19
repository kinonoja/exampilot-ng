import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { BookOpenCheck, CreditCard, LayoutDashboard, LogOut, MessageCircleQuestion, PanelLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ExamMark } from "./ExamMark";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpenCheck, label: "Practice", path: "/practice" },
  { icon: MessageCircleQuestion, label: "Tutor", path: "/tutor" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) return <div className="grid min-h-screen place-items-center bg-[#f9f6ef] p-6"><div className="max-w-sm text-center"><ExamMark /><h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-slate-950">Your study space is waiting.</h1><p className="mt-3 text-sm leading-6 text-slate-600">Sign in to keep your practice, study target, and billing access in one place.</p><Button onClick={() => startLogin()} className="mt-6 h-11 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800">Sign in to ExamPilot</Button></div></div>;
  return <SidebarProvider><StudentShell>{children}</StudentShell></SidebarProvider>;
}

function StudentShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const active = menuItems.find(item => item.path === location)?.label ?? "ExamPilot";
  return <><Sidebar collapsible="offcanvas" className="border-r border-slate-800 bg-slate-950 text-white"><SidebarHeader className="p-5"><ExamMark inverted /></SidebarHeader><SidebarContent className="px-3"><p className="px-2 pb-2 pt-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Study space</p><SidebarMenu>{menuItems.map(item => <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={location === item.path} onClick={() => setLocation(item.path)} className="h-11 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white data-[active=true]:bg-lime-300 data-[active=true]:text-slate-950"><item.icon className="h-4 w-4" /><span className="font-medium">{item.label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarContent><SidebarFooter className="m-3 rounded-2xl border border-white/10 bg-white/5 p-3"><div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarFallback className="bg-emerald-700 text-xs font-bold text-white">{user?.name?.charAt(0).toUpperCase() || "E"}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{user?.name || "ExamPilot learner"}</p><p className="truncate text-xs text-slate-400">{user?.email || "Study account"}</p></div></div><button onClick={logout} className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white"><LogOut className="h-3.5 w-3.5" /> Sign out</button></SidebarFooter></Sidebar><SidebarInset className="bg-[#f9f6ef]"><header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-[#f9f6ef]/90 px-4 backdrop-blur sm:px-6"><SidebarTrigger className="rounded-lg text-slate-700 hover:bg-slate-200"><PanelLeft className="h-4 w-4" /></SidebarTrigger><p className="font-display text-lg font-bold tracking-tight text-slate-950">{active}</p></header><main className="p-4 sm:p-6 lg:p-8">{children}</main></SidebarInset></>;
}
