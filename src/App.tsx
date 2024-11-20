import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import AdminPage from "./vet";


const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/vet" element={<AdminPage />} />

    </Routes>
  </Router>
);

export default App;
