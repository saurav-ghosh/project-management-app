import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import lwsLogo from "../assets/images/logo.png";
import logout from "../assets/images/logout.png";
import { userLoggedOut } from "../features/auth/authSlice";
import { setSearch } from "../features/filter/filterSlice";

const Navbar = ({ searchBox }) => {
    const { user } = useSelector((state) => state.auth) || {};
    const dispatch = useDispatch();
    const location = useLocation();
    const activeLink = location?.pathname === "/teams";

    const debouncedSearch = (fn, delay) => {
        let timeOutId;
        return (...args) => {
            clearTimeout(timeOutId);

            timeOutId = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    };

    const doSearch = (value) => {
        dispatch(setSearch(value.toLowerCase()));
    };

    const handleSearch = debouncedSearch(doSearch, 500);

    const handleLogout = () => {
        dispatch(userLoggedOut());
        localStorage.clear();
    };

    return (
        <div className="flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75">
            <img src={lwsLogo} className="h-10 w-10" alt="" />

            <div className="ml-10">
                <Link
                    className={`mx-2 text-sm font-semibold ${
                        activeLink
                            ? "text-indigo-700"
                            : "text-gray-600 hover:text-indigo-700"
                    } `}
                    to="/teams"
                >
                    Teams
                </Link>
                <Link
                    className={`mx-2 text-sm font-semibold ${
                        !activeLink
                            ? "text-indigo-700"
                            : "text-gray-600 hover:text-indigo-700"
                    } `}
                    to="/projects"
                >
                    Projects
                </Link>
            </div>
            {searchBox && (
                <input
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex items-center h-10 px-4 ml-10 text-sm bg-gray-200 rounded-full focus:outline-none focus:ring"
                    type="search"
                    placeholder="Search for projects..."
                />
            )}
            <div className="flex items-center justify-center ml-auto gap-5">
                <button className="w-8 h-8 overflow-hidden rounded-full cursor-pointer">
                    <img src={user?.avatar} alt="avatar" />
                </button>
                <button
                    onClick={handleLogout}
                    className="w-7 h-7 overflow-hidden rounded-full cursor-pointer"
                >
                    <img src={logout} alt="logout" />
                </button>
            </div>
        </div>
    );
};

export default Navbar;
