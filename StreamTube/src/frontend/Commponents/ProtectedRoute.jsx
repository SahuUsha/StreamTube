
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
}

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <h1>Welcome to your home page!</h1>
    </div>
  );
};

export default HomePage;


// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const navigate = useNavigate();
//   const isAuthenticated = localStorage.getItem("token"); // or use auth context

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/"); // Redirect if not logged in
//     }
//   }, [isAuthenticated, navigate]);

//   return isAuthenticated ? children : null;
// };

// export default ProtectedRoute;
