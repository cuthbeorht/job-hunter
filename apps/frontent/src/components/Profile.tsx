import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";

export default function Profile() { 
    const {user, logout, token} = useAuth();

    function handleLogout() {
        logout();
    }
    
    return (
        <div>
        {
            token ? (<button onClick={handleLogout}>Logout</button>) : (<Navigate to="/login" />)
        }
        </div>
    );
        
    
}