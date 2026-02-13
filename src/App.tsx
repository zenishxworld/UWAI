import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import UniversityDetail from "./pages/UniversityDetail";
import Transparency from "./pages/Transparency";
import ROICalculator from "./pages/ROICalculator";
import Disclaimer from "./pages/Disclaimer";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PageTransition from "./components/PageTransition";

function App(): JSX.Element {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/explore" element={<PageTransition><Explore /></PageTransition>} />
        <Route path="/explore/:country/:slug" element={<PageTransition><UniversityDetail /></PageTransition>} />
        <Route path="/transparency" element={<PageTransition><Transparency /></PageTransition>} />
        <Route path="/roi-calculator" element={<PageTransition><ROICalculator /></PageTransition>} />
        <Route path="/disclaimer" element={<PageTransition><Disclaimer /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
