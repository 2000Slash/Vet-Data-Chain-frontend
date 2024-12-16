import { nodeInteraction } from "@waves/waves-transactions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getKeeperWalletURL, getKeeperWalletAddress } from "../../utils/utils";

const Login_box = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleKeeperWalletLogin = async () => {
    setLoading(true);
    const key = "role";
    const address = await getKeeperWalletAddress();
    const nodeUrl = await getKeeperWalletURL();

    let role = await nodeInteraction.accountDataByKey(key, address, nodeUrl);
    console.log(role);
    if (role && role.value) {
      navigate(`/${role.value}`);
      setLoading(false);
    } else {
      console.error("Role is null or value is undefined.");
    }
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
function asynch() {
  throw new Error("Function not implemented.");
}

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
