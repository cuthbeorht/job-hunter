import { createBrowserRouter } from "react-router";
import App from "./App";
import ExperienceItems from "./components/ExperienceItems";

export const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        {
            path: "work-experiences",
            element: <ExperienceItems />
        }
    ]
}]);