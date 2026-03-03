import { Route, Routes } from "react-router-dom";

import '../App';
import Chat from "../pages/Chat";
import Login from "../pages/Login";

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default UserRoutes;