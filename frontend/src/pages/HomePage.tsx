import { useAuthContext } from "../contexts/AuthContext";
import { withAuthGuard } from "../hocs/AuthGuard";

export const HomePage = withAuthGuard(() => {
    const { user } = useAuthContext();
    
    return (
        <p>Hello {user.firstName} !</p>
    );
});

