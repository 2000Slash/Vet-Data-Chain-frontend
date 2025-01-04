import { nodeInteraction } from "@waves/waves-transactions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getKeeperWalletURL, getKeeperWalletAddress, getMyRole } from "../../utils/utils";
import "../../styles/styles.css";
import "../../styles/details/loginbox.css";

import "../../styles/styles.css";
import "../../styles/details/loginbox.css";

const Login_box = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const rerouting = async () => {
    try {
      let role = await getMyRole();
      console.log(role);
      navigate(`/${role}`);
    } catch (error) {
      console.error("Error in reroute:", error);
    }
  };

  const handleKeeperWalletLogin = () => {
    KeeperWallet.publicState()
      .then((state) => {
        setLoading(true);
        console.log(state);
        localStorage.setItem("keeperWalletPublicState", JSON.stringify(state));
        rerouting();
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="card login-card">
      <div className="info-icon" onClick={() => setShowModal(true)}>
        i
      </div>
      <div className="login-icon">
        <img src="/public/login-2.png" alt="login-icon" />
      </div>
      <div className="upload-section">
        <p>Please log in with your Keeper Wallet account.</p>
      </div>
      <button className="login-button" onClick={handleKeeperWalletLogin}>
        Login
      </button>
    </div>
  );
};

export default Login_box;
