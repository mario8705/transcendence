import { useAuthContext } from "../contexts/AuthContext";

export const HomePage = () => {
    const { user } = useAuthContext();
    
    return (
        <p>Hello {user.firstName} !</p>
    );
};

