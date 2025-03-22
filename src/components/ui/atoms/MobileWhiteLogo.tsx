import React from "react";

const MobileWhiteLogo: React.FC = () => {
  return (
    <img
      src="/static/iconcmg.svg"
      alt="CMG Logo"
      width={40}
      height={140}
      style={{
        height: "auto",
        filter: "brightness(0) invert(1)", // Makes the logo white
      }}
    />
  );
};

export default MobileWhiteLogo;
