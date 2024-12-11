import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { createContext, useContext, useState } from 'react';
import Login from "./pages/login_page";
import Vetenary_office from "./pages/vetenary_office_page"
import Farmer from "./pages/farmer_page";

import  from "zustand";

export const useKeeperWalletStore = create((set) => ({
  keeperWalletState: null, // Initial state for Keeper Wallet data
  setKeeperWalletState: (state) => set({ keeperWalletState: state }), // Action to update the state
}));
const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/vetenary_office" element={<Vetenary_office />} />
      <Route path="/farmer" element={<Farmer />} />
    </Routes>
  </Router>
);

export default App;