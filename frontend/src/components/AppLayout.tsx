import { Outlet } from "react-router-dom";
import SocketContextComponent from "./Socket/Context/Component";
import { withAuthGuard } from "../hocs/AuthGuard";

export const AppLayout: React.FC = withAuthGuard(() => (
    <SocketContextComponent>
        <Outlet />
    </SocketContextComponent>
));
