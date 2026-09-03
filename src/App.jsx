import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Books from "./components/Books";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route 
                    path="/books" 
                    element={
                        <ProtectedRoute>
                            <Books />
                        </ProtectedRoute>
                    } />
                    
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;