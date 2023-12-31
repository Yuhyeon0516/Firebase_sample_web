import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Join from "./auth/email/Join";
import Login from "./auth/email/Login";
import Naver from "./auth/naver/Naver";
import Kakao from "./auth/kakao/Kakao";
import Post from "./post/Post";

const router = createBrowserRouter([
    {
        path: "/",
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "join",
                element: <Join />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "naver",
                element: <Naver />,
            },
            {
                path: "kakao",
                element: <Kakao />,
            },
        ],
    },
    {
        path: "/post",
        children: [
            {
                path: "",
                element: <Post />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
