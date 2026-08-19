import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import PremiumBilling from "./pages/PremiumBilling";
import PremiumDashboard from "./pages/PremiumDashboard";
import PremiumHome from "./pages/PremiumHome";
import PremiumPractice from "./pages/PremiumPractice";
import PremiumTutor from "./pages/PremiumTutor";
import { MasteryRailMini } from "./components/MasteryRailMini";

const StudentDashboard = () => <DashboardLayout><MasteryRailMini current="focus" /><PremiumDashboard /></DashboardLayout>;
const StudentPractice = () => <DashboardLayout><MasteryRailMini current="practice" /><PremiumPractice /></DashboardLayout>;
const StudentBilling = () => <DashboardLayout><MasteryRailMini current="ready" /><PremiumBilling /></DashboardLayout>;
const StudentTutor = () => <DashboardLayout><MasteryRailMini current="understand" /><PremiumTutor /></DashboardLayout>;

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={PremiumHome} />
      <Route path={"/dashboard"} component={StudentDashboard} />
      <Route path={"/practice"} component={StudentPractice} />
      <Route path={"/tutor"} component={StudentTutor} />
      <Route path={"/billing"} component={StudentBilling} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
