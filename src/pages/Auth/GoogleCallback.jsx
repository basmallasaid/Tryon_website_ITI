import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const fname = searchParams.get("fname");
    const lname = searchParams.get("lname");
    const id = searchParams.get("_id");
    const image = searchParams.get("image");
    const role = searchParams.get("role") || "user";

    if (token && email) {
      const userData = { id, email, token, firstName: fname, lastName: lname, userImage: image, role };

      if (window.opener) {
        window.opener.postMessage(
          { type: "GOOGLE_AUTH_SUCCESS", payload: userData },
          window.origin
        );
        window.close();
      } else {
        console.log("Google OAuth login successful", userData);
        login(userData);
        if (userData.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } else if (!window.opener) {
      navigate("/", { replace: true });
    }
  }, [login, navigate, searchParams]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#0A0E17" }}>
      <CircularProgress sx={{ color: "#00E5FF" }} />
    </Box>
  );
}
