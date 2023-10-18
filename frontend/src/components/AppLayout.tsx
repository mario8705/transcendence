import { Outlet } from "react-router-dom";
import SocketContextComponent from "./Socket/Context/Component";
import { withAuthGuard } from "../hocs/AuthGuard";
import Navigation from "./Navigation/Navigation";

export const AppLayout: React.FC = withAuthGuard(() => (
    <SocketContextComponent>
        <Navigation isSignedIn={true} />
        <Outlet />
    </SocketContextComponent>
));
