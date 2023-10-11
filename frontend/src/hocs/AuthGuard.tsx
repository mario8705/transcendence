import { AuthGuard } from "../guards/AuthGuards";

export const withAuthGuard = <P extends {}>(Component: React.FC<P>) => (props: P) => (
    <AuthGuard>
        <Component {...props} />
    </AuthGuard>
);
