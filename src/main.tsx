import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import AppProvider from "./components/appContext/AppContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AppProvider>
                <App />
        </AppProvider>
    </BrowserRouter>
)
