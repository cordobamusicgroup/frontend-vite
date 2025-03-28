import { Navigate } from "react-router";

export default function RedirectToBackoffice() {
  return <Navigate to="/backoffice" replace />;
}
