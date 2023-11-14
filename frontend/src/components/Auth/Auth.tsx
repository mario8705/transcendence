import React from 'react';
import { AuthMethodPicker, AuthenticationPanel } from '../DoubleAuth/DoubleAuth';
import LoginForm from '../LoginForm/LoginForm';
import { Panel, PanelContainer } from './PanelContainer';
import { AuthReducerProps, authReducer, backToMethodPicker, kAuthDefaultState, setSelectedMfa } from './auth-reducer';

type AuthManagerProps = AuthReducerProps;

const AuthManager: React.FC<AuthManagerProps> = ({ state, dispatch }) => {
    return (
        <>
            <Panel index={0}>
                <LoginForm state={state} dispatch={dispatch} />
            </Panel>
            <Panel index={1}>
                <AuthMethodPicker
                    methods={state.mfa || []}
                    onMethodPicked={method => dispatch(setSelectedMfa(method))} />
            </Panel>
            <Panel index={2}>
                <AuthenticationPanel
                    authenticationMode={state.selectedMfa || ''}
                    onBack={() => dispatch(backToMethodPicker())}/>
            </Panel>
        </>
    );
};

export const Auth: React.FC = () => {
    const [ state, dispatch ] = React.useReducer(authReducer, kAuthDefaultState);

	return (
        <PanelContainer currentIndex={state.currentPanelIndex}>
            <AuthManager state={state} dispatch={dispatch} />
        </PanelContainer>
	);
};
