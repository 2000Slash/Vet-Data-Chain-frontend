import React from "react";

type HeaderProps = {
  role?: string;
};

const Header = ({ role = "" }: HeaderProps) => {
  return (
    <div className="header">
      <div className="role-text">
        <h2>{role}</h2>
      </div>
      <div className="title-container">
        <h1>Vet-Data-Chain</h1>
      </div>
      <div className="logo-container">
        <div className="logo-circle"></div>
      </div>
    </div>
  );
};

export default Header;
