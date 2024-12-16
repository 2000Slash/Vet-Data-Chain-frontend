type HeaderProps = {
  role?: string;
};

const Header = ({ role = "" }: HeaderProps) => {
  if (role) {

    return (
      <div className="header profile-header">
        <div className="role-text">
          <h1>{role}</h1>
        </div>
        <div className="logo-container">
          <div className="logo-circle"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="header login-header">
      <div className="logo-container">
        <div className="logo-circle"></div>
      </div>
      <div className="title-container">
        <h1>Vet-Data-Chain</h1>
      </div>
    </div>
  );
};

export default Header;