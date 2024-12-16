import React from "react";
import InfoBox_Text from "../components/login/infobox";
import Login_box from "../components/login/loginbox";
import Header from "../components/shared_components/Header";
import "../styles/login.css";

const Login_Page = () => {
  return (
    <div className="page-container">
      <Header />
      <div className="content-wrapper">
        <div className="side-by-side-container">
          <div className="content-box">
            <InfoBox_Text
              title="Vet-Data-Chain"
              content="Vet-Data-Chain is your innovative partner for managing Application
              and Delivery Records (AuA Records) with ease and confidence.
              Designed for veterinarians, farmers, and veterinary authorities,
              this cutting-edge solution simplifies the way vital data is
              recorded, shared, and verified."
            />
          </div>
          <div className="content-box">
            <Login_box />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login_Page;
