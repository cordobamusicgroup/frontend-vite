import { Skeleton } from "@mui/material";

const TableSkeletonLoader: React.FC = () => {
  return <Skeleton variant="text" animation="wave" height={30} sx={{ marginTop: "5px" }} />;
};

export default TableSkeletonLoader;
