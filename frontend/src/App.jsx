import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/Toast";
import Home from "./pages/Home";
import './app.css'

function App() {

  return (
    <>
     <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <Home />
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
    </>
  )
}

export default App
