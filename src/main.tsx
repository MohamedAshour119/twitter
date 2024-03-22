import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import AppProvider from "./components/appContext/AppContext.tsx";
import TweetProvider from "./components/appContext/TweetContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AppProvider>
            <TweetProvider>
                <App />
            </TweetProvider>
        </AppProvider>
    </BrowserRouter>
)
