import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearAuth } from "@/redux/auth/auth.slice";
import { RootState } from "@/redux/store";
import Cookies from "js-cookie";
import axios from "axios";

const useAuthSession = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  //  implement the logic here to check user session
  useEffect(() => {
    const userSession = async () => {
      const token = Cookies.get("authToken");
      if (!token) {
        dispatch(clearAuth());
      }
      try {
        const response = await axios.get("/api/sessionToken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.valid) {
          dispatch(setUser(response.data.user));
        } else {
          dispatch(clearAuth());
        }
      } catch (error) {
        dispatch(clearAuth());
      }
    };
    userSession();
  }, [dispatch,token]);
  return user;
};

export default useAuthSession;
