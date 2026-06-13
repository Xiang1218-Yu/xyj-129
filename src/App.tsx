import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    document.title = "年度财务报表.xlsx - Excel";
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/other" element={<Home />} />
      </Routes>
    </Router>
  );
}
