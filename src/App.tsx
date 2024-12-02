// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import FarmerDashboard from "./farmer";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/farmer" element={<FarmerDashboard />} />
    </Routes>
  </Router>
);

export default App;
