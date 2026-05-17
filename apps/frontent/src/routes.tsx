import { createBrowserRouter } from "react-router";
import App from "./App";
import ExperienceItems from "./components/ExperienceItems";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";

export const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        {
            path: "/login",
            element: <Login />
        }, {
            path: "/",
            element: <ProtectedRoute />,
            children: [{
                path: "/work-experiences",
                element: <ExperienceItems />
            }]
        }
    ]
}]);