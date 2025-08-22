import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/layout/ErrorBoundary';


import './styles/index.css'
import './styles/animations.css'
import './styles/App.css'
import './styles/Sidebar.css'
import './styles/PokemonDetails.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
)