import { nodeInteraction } from "@waves/waves-transactions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login_box = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const rerouting = async () => {
    try {
      let accountdata = JSON.parse(
        localStorage.getItem("keeperWalletPublicState")
      );
      const key = "role";
      const adress = accountdata.account.address;
      const nodeUrl = accountdata.network.server;
      let role = await nodeInteraction.accountDataByKey(key, adress, nodeUrl);
      console.log(role);
      navigate(`/${role.value}`);
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
      <div className="upload-section">
        <p>Please log in with your Keeper Wallet account.</p>
      </div>
      <button className="login-button" onClick={handleKeeperWalletLogin}>
        Login
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              🡐
            </button>
            <p>
              If you have not yet received your credentials file, please contact
              your responsible veterinary office.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login_box;
