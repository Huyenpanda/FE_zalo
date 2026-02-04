import { Route, Routes } from "react-router-dom";

import '../App';
import Chat from "../pages/Chat";

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Chat />} />
        </Routes>
    );
}

export default UserRoutes;