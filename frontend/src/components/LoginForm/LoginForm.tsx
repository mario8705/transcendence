import React, { FormEvent } from 'react';
import MainButton from '../MainButton/MainButton'
import { IoMailOutline, IoLockClosedOutline } from 'react-icons/io5';
import './LoginForm.css';
import { useMutation } from 'react-query';
import { loginWithPassword } from '../../api';
import { AuthReducerProps } from '../Auth/auth-reducer';

type LoginFormProps = Pick<AuthReducerProps, 'dispatch'>;

type EmailAndPassword = {
    email: string;
    password: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ dispatch }) => {
	const authorizeUrl = React.useMemo(() => {
		const url = new URL('https://api.intra.42.fr/oauth/authorize');
		const { searchParams } = url;

		searchParams.append('client_id', 'u-s4t2ud-8d978e732262281f66a1efd2053be66c07e8f1ec16d7ca8e7c73c5c058f01068');
		searchParams.append('redirect_uri', 'http://localhost:5173/auth/callback');
		searchParams.append('response_type', 'code');

		return url.href;
	}, []);

	const loginMutation = useMutation(({ email, password }: EmailAndPassword) => loginWithPassword(email, password), {
		onSuccess(response) {
            const { data } = response;

            if ('ticket' in data) {
                dispatch(setTicketAction('', [ 'sms' ]));
            }
		},
		onError(error, variables, context) {
			console.log(error, variables, context);
		},
	});

	const handleOnSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
		const formData = new FormData(e.currentTarget);
		const email = formData.get('email')?.toString()!;
		const password = formData.get('password')?.toString()!;

		if (!loginMutation.isLoading) {
			loginMutation.mutate({ email, password });
		}

		e.preventDefault();
	}, []);

	return (
		<form action="#" className="login-form" onSubmit={handleOnSubmit}>
			<h2>Login</h2>
			<div className="input-box">
				<label>Email</label>
				<input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					// required
				/>
				<IoMailOutline className="icon" />
			</div>
			<div className="input-box">
				<label>Password</label>
				<input
					id="password"
					name="password"
					type="password"
					// required
				/>
				<IoLockClosedOutline className="icon" />
			</div>
			<div className="remember-forgot">
				<input type="checkbox" name="remember_me" />Remember me
				<a href="#">Forgot Password?</a>
			</div>
			<MainButton as="button" type="submit" buttonName="Login" loading={loginMutation.isLoading} />
			<p className="or">or</p>
			<MainButton as="a" href={authorizeUrl} buttonName="42 Account" />
			<p>Don't have an account ? <a href="#" className="register-link">Register</a></p>
		</form>
	);
};

export default LoginForm;