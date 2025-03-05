import {createRoot} from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import router from "./router";


const setupAll = () => {
    const root = createRoot(
        document.getElementById('root') as HTMLElement,
    )

    root.render(
        <RouterProvider router={router}/>,
    )
}

setupAll();