
export interface IAuthState {
    ticket?: string;
    mfa?: string[];
    selectedMfa?: string;

    currentPanelIndex: number;

    sms?: any;
    email?: any;
}

export interface IAuthAction {
    type: string;
}

export interface ISetTicketAction {
    type: 'SET_TICKET';
    ticket: string;
    mfa: string[];
}

export interface ISetSelectedMfa {
    type: 'SET_SELECTED_MFA';
    selectedMfa: string;
}

export interface ISetMfaStateAction {
    type: 'SET_MFA_STATE';
    mfa: string;
    mfaState: any;
}

export const setTicketAction = (ticket: string, mfa: string[]) => ({ type: 'SET_TICKET', ticket, mfa });

export const setSelectedMfa = (selectedMfa: string) => ({ type: 'SET_SELECTED_MFA', selectedMfa });

export const backToMethodPicker = () => ({ type: 'BACK_TO_PICKER' });

export const setMfaState = (mfa: string, mfaState: any) => ({ type: 'SET_MFA_STATE', mfa, mfaState });

function patchState<T>(state: T, patch: Partial<T>): T {
    return {
        ...state,
        ...patch,
    };
}

export function authReducer(state: IAuthState, action: IAuthAction): IAuthState {
    const { type } = action;
    
    if ('SET_TICKET' === type) {
        const { ticket, mfa } = action as ISetTicketAction;

        return patchState(state, {
            ticket, mfa, currentPanelIndex: 1,
        });
    } else if ('SET_SELECTED_MFA' === type) {
        const { selectedMfa } = action as ISetSelectedMfa;

        return patchState(state, {
            currentPanelIndex: 2,
            selectedMfa,
        });
    } else if ('BACK_TO_PICKER' === type) {
        return patchState(state, {
            currentPanelIndex: 1,
        });
    } else if ('SET_MFA_STATE' === type) {
        const { mfa, mfaState } = action as ISetMfaStateAction;

        return patchState(state, {
            [mfa]: mfaState,
        });
    }
    return state;
}

export const kAuthDefaultState: IAuthState = {
    currentPanelIndex: 0,
};

export type AuthReducerProps = {
    state: IAuthState,
    dispatch: React.Dispatch<IAuthAction>,
};
