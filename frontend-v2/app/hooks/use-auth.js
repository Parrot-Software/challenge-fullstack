import { useState, useEffect } from "react";

function useAuth() {
  const [authData, setAuthData] = useState({ token: null, user: {} });

  useEffect(() => {
    const getTokenFromCookies = (name) => {
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
    };

    let token = getTokenFromCookies("auth-token");
    let user = JSON.parse(getTokenFromCookies("user") || "null");

    if (!token) {
      const refreshToken = getTokenFromCookies("auth-refresh");
      if (refreshToken) {
        // Aquí deberías implementar la lógica para revalidar el token
        // usando el refreshToken. Esto podría implicar una llamada a un
        // endpoint de tu API que devuelva un nuevo auth-token.
        // Por ejemplo:
        // token = revalidateToken(refreshToken);
      } else {
        // Redirigir al usuario a una página específica si no hay token
        window.location.href = "/";
      }
    }

    setAuthData({ token, user });
  }, []);

  return authData;
}

export default useAuth;
