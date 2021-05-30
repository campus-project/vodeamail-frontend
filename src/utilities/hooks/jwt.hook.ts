import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIsMounted } from "./mounted.hook";
import { jwtService } from "../services/jwt.service";
import { setUser } from "../../store/actions/auth.action";

export const useJwtService = (disableAutoFetchUser = false) => {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const { auth } = useSelector(({ auth }: any) => ({
    auth,
  }));

  const [isOnSignIn, setIsOnSignIn] = useState(false);
  const [isOnFetchingUser, setIsOnFetchingUser] = useState(
    !disableAutoFetchUser
  );

  const fetchUser = async () => {
    return new Promise(async (resolve, reject) => {
      const accessToken = jwtService.getAccessToken();
      if (accessToken && !auth.isLogged) {
        setIsOnFetchingUser(true);

        await jwtService
          .fetchUser()
          .then((resp: any) => dispatch(setUser(resp.data.data)))
          .catch((e) => reject(e));

        if (isMounted.current) {
          setIsOnFetchingUser(false);
        }
      }

      resolve(true);
    });
  };

  const login = async (email: string, password: string) => {
    return new Promise(async (resolve, reject) => {
      setIsOnSignIn(true);

      await jwtService
        .login(email, password)
        .then(() => setIsOnFetchingUser(true))
        .catch((error) => reject(error));

      setIsOnSignIn(false);
    });
  };

  const logout = async () => {
    return new Promise(async (resolve, reject) => {
      await jwtService.logout().then((resp) => {
        dispatch(setUser(null));
        resolve(resp);
      });
    });
  };

  useMemo(() => {
    (async () => {
      if (isOnFetchingUser) {
        await fetchUser()
          .then(() => {})
          .catch(() => {});
      }

      if (isMounted.current) {
        setIsOnFetchingUser(false);
      }
    })();
  }, [isOnFetchingUser]);

  return {
    isOnSignIn,
    isOnFetchingUser,
    login,
    fetchUser,
    logout,
  };
};
