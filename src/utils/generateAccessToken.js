import Cookies from "js-cookie";
import axios from "../axios";

export const generateAccessToken = async () => {
  try {
    const refreshToken = Cookies.get("refresh_token");
    const response = await axios.post("auth/refresh", {
      refresh_token: refreshToken,
    });
    const { access_token, refresh_token} = response.data.data;
    //set access token
    Cookies.set("access_token", access_token, {
      expires: 1,
      //secure:true,
      sameSite: "Strict",
      path: "/",
    });

    //set refresh token
    Cookies.set("refresh_token", refresh_token, {
      expires: 7,
      //secure:true,
      sameSite: "Strict",
      path: "/",
    });
    console.log("access token is generating...");
  } catch (error) {
    console.log("error in generating refresh token", error);
  }
};
