import React from 'react';
import './LoginForm.css';
import MainButton from '../MainButton/MainButton'
import { IoMailOutline } from "react-icons/io5";
import { IoLockClosedOutline } from "react-icons/io5";

interface Props {
    onRouteChange: (route: string) => void;
}

const LoginForm: React.FC<Props> = ({ onRouteChange }) => {
	return (
		<div className="box-parent">
			<div className="box-popup">
				<form action="#">
					<h2>Login</h2>
					<div className="input-box">
						<label>Email</label>
						<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
						/>
						<IoMailOutline className="icon"/>
					</div>
					<div className="input-box">
						<label>Password</label>
						<input
						id="password"
						name="password"
						type="password"
						required/>
						<IoLockClosedOutline className="icon"/>
					</div>
					<div className="remember-forgot">
						<input type="checkbox"/>Remember me
						<a href="#">Forgot Password?</a>
					</div>
					<MainButton buttonName='Login'/>
					<div className="input-box">
						<p>or</p>
					<MainButton buttonName='42 Account'/>
					</div>
					<p>Don't have an account ? <a href="#" className="register-link">Register</a></p>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;