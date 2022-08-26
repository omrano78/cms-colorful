import { useRouter } from "next/router";
import { useAuth } from "./auth";
import redirect from "nextjs-redirect";
const ProtectRoute = ({ children }) => {
  let route = useRouter();

  const { redirectToEarlyAccess, isAuthenticated, login, loading, logout } = useAuth();

  if (route.route != "/early-access" && isAuthenticated == false) {
    redirectToEarlyAccess(route);
  }
  return children;
};
export default ProtectRoute;
