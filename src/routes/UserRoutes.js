import { Route, Routes } from "react-router-dom";

import '../App';
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    );
}

export default UserRoutes;