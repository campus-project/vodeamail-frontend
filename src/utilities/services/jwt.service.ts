import axios, { AxiosError, AxiosResponse } from "axios";

export interface IJwt {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export const KEY_ACCESS_TOKEN = "auth.access_token";
export const KEY_REFRESH_TOKEN = "auth.refresh_token";
export const KEY_EXPIRES_IN = "auth.expires_in";

const endPointToken = (): string =>
  process.env.REACT_APP_JWT_END_POINT_TOKEN ||
  "http://localhost:3000/v1/auth/login";

const endPointAccount = (): string =>
  process.env.REACT_APP_JWT_END_POINT_ACCOUNT ||
  "http://localhost:3000/v1/account";

class JwtService {
  constructor() {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  getAccessToken() {
    const accessToken = window.localStorage.getItem(KEY_ACCESS_TOKEN);
    if (!accessToken) {
      return false;
    }

    const expiresIn = window.localStorage.getItem(KEY_EXPIRES_IN);
    if (expiresIn && Number(expiresIn) <= Math.floor(Date.now() / 1000)) {
      return false;
    }

    return accessToken;
  }

  setToken = (oauthToken: IJwt | null) => {
    if (oauthToken === null) {
      localStorage.removeItem(KEY_ACCESS_TOKEN);
      localStorage.removeItem(KEY_REFRESH_TOKEN);
      localStorage.removeItem(KEY_EXPIRES_IN);

      delete axios.defaults.headers.common["Authorization"];
    } else {
      localStorage.setItem(KEY_ACCESS_TOKEN, oauthToken.access_token);
      localStorage.setItem(KEY_REFRESH_TOKEN, oauthToken.refresh_token);
      localStorage.setItem(KEY_EXPIRES_IN, String(oauthToken.expires_in));

      axios.defaults.headers.common[
        "Authorization"
      ] = `${oauthToken.token_type} ${oauthToken.access_token}`;
    }
  };

  login = (email: string, password: string) => {
    return new Promise(async (resolve, reject) => {
      axios
        .post(endPointToken(), { email, password })
        .then((response) => {
          this.setToken(response.data);
          resolve(response);
        })
        .catch((error: AxiosError) => {
          this.setToken(null);
          reject(error);
        });
    });
  };

  logout = async () => {
    return new Promise(async (resolve) => {
      this.setToken(null);
      resolve(true);
    });
  };

  fetchUser = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(endPointAccount())
        .then((response: AxiosResponse) => resolve(response))
        .catch((error: AxiosError) => reject(error));
    });
  };
}

export const jwtService = new JwtService();
