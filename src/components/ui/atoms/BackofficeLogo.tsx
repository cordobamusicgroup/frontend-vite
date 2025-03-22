interface Props {
  small: boolean;
}

const BackofficeLogo: React.FC<Props> = ({ small }) => {
  return <img src={small ? "/static/iconcmg.svg" : "/static/logocmg.svg"} alt="CMG Logo" width={0} height={0} style={{ width: small ? "40px" : "140px", height: "auto" }} />;
};

export default BackofficeLogo;
