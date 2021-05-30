import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useJwtService } from "../utilities/hooks/jwt.hook";

const Logout: React.FC<any> = () => {
  const navigate = useNavigate();
  const { logout } = useJwtService();

  useEffect(() => {
    logout().then(() => {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    });
  }, []);

  return <>Please wait...</>;
};

export default Logout;
