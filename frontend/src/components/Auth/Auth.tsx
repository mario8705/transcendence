import React from 'react';
import { AuthMethodPicker, AuthenticationMode, AuthenticationPanel } from '../DoubleAuth/DoubleAuth';
import LoginForm from '../LoginForm/LoginForm';
import { Panel, PanelContainer } from './PanelContainer';
import { AuthReducerProps, authReducer, backToMethodPicker, kAuthDefaultState, setSelectedMfa } from './auth-reducer';
import { useSearchParams } from 'react-router-dom';

type AuthManagerProps = AuthReducerProps;

const AuthManager: React.FC<AuthManagerProps> = ({ state, dispatch }) => {
    return (
        <>
            <Panel index={0}>
                <LoginForm dispatch={dispatch} />
            </Panel>
            <Panel index={1}>
                <AuthMethodPicker
                    methods={state.mfa || []}
                    onMethodPicked={method => dispatch(setSelectedMfa(method))} />
            </Panel>
            <Panel index={2}>
                <AuthenticationPanel
                    state={state}
                    dispatch={dispatch}
                    authenticationMode={state.selectedMfa! as AuthenticationMode}
                    onBack={() => dispatch(backToMethodPicker())}/>
            </Panel>
        </>
    );
};

type AuthProps = {
    isCallbackUrl?: boolean;
};

export const Auth: React.FC<AuthProps> = ({ isCallbackUrl }) => {
    const [ state, dispatch ] = React.useReducer(authReducer, kAuthDefaultState);
    const [ searchParams ] = useSearchParams();
    const code = searchParams.get('code');

	return (
        <PanelContainer currentIndex={state.currentPanelIndex}>
            <AuthManager state={state} dispatch={dispatch} />
        </PanelContainer>
	);
};
