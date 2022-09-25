import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/auth/authSlice";

export default function useAuthCheck() {
    const dispatch = useDispatch();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const authToken = localStorage.getItem("auth");

        if (authToken) {
            const parsedToken = JSON.parse(authToken);

            if (parsedToken.accessToken && parsedToken.user) {
                dispatch(
                    userLoggedIn({
                        accessToken: parsedToken.accessToken,
                        user: parsedToken.user,
                    })
                );
            }
        }
        setAuthChecked(true);
    }, [dispatch]);

    return authChecked;
}
