import React, { useState } from "react";
import lwsLogo from "../assets/images/logo.png";
import Error from "../components/Ui/Error";
import Spinner from "../components/Ui/Spinner";
import { useLoginMutation } from "../features/auth/authApi";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, { isLoading, isError, error }] = useLoginMutation();

    const handleLogin = (e) => {
        e.preventDefault();

        login({
            email,
            password,
        })
            .unwrap()
            .then((res) => {
                setEmail("");
                setPassword("");
            });
    };

    return (
        <div className="grid place-items-center h-screen bg-[#F9FAFB">
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src={lwsLogo}
                            alt="Learn with sumit"
                        />
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label className="sr-only">Email address</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label className="sr-only">Password</label>
                                <input
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                            >
                                {isLoading ? <Spinner /> : "Sign in"}
                            </button>
                        </div>
                    </form>
                    {isError && <Error message={error?.data} />}
                    <ul className="shadow px-8 py-2 text-gray-700 leading-tight rounded-md border-[1px] border-pink-200 list-disc">
                        <li>josesaurav@gmail.com</li>
                        <li>sean.green@gmail.com</li>
                        <li>samantha.lambert@gmail.com</li>
                        <li>flenn.kuhn@gmail.com</li>
                        <li>Password: 12345 (valid for all accounts)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Login;
