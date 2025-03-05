import ErrorPage from "../pages/ErrorPage";
import {createBrowserRouter} from "react-router-dom";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import UpdatePassword from "../pages/UpdatePassword";

const routes = [
    {
        path: '/',
        element: <div>index</div>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/login',
        element: <LoginPage/>,
    }, {
        path: '/register',
        element: <RegisterPage/>,
    }, {
        path: "update_password",
        element: <UpdatePassword/>,
    }
]

const router = createBrowserRouter(routes);

export default router;