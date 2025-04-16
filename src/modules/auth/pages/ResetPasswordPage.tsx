import { useLocation } from 'react-router';

export default function ResetPasswordPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  return (
    <div>
      <h1>Reset Password Page</h1>
      <p>Token: {token}</p>
    </div>
  );
}
