import { nodeInteraction } from "@waves/waves-transactions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getKeeperWalletURL,
  getKeeperWalletAddress,
  getMyRole,
} from "../../utils/utils";
import "../../styles/styles.css";
import "../../styles/details/loginbox.css";

const Login_box = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const rerouting = async () => {
    if (typeof KeeperWallet !== "undefined") {
      let locked = (await KeeperWallet.publicState()).locked;
      if (locked) {
        KeeperWallet.auth({ data: "Please unlock your wallet" })
          .then(async (authData) => {
            try {
              let role = await getMyRole();
              navigate(`/${role}`);
            } catch (error) {
              console.error("Error in reroute:", error);
            }
          })
          .catch((error) => {
            console.error("Failed to unlock the wallet:", error);
          });
      } else {
        try {
          let role = await getMyRole();
          navigate(`/${role}`);
        } catch (error) {
          console.error("Error in reroute:", error);
        }
      }
    } else {
      console.error("Keeper Wallet is not installed");
    }
  };

  const handleKeeperWalletLogin = () => {
    KeeperWallet.publicState()
      .then((state) => {
        setLoading(true);
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
