import { useNavigate, useLocation } from "react-router-dom";

const useRedirectToLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToLogin = () => {
    navigate("/login", { state: { from: location } });
  };

  return redirectToLogin;
};

export default useRedirectToLogin;
