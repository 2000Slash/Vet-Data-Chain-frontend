import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/loginPage";
import VetenaryOffice from "./pages/vetenaryOfficePage"
import Farmer from "./pages/farmerPage";
import { initDatabase } from "./utils/database";



const App: React.FC = () => {
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDatabase();
      } catch (error) {
        console.error("initializeDB Error", error);
      }
    };

    initializeDB();
  }, []); 
  return(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/vetoffice" element={<VetenaryOffice />} />
      <Route path="/farmer" element={<Farmer />} />
    </Routes>
  </Router>)
};

export default App;