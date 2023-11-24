import React from 'react';
import './RegisterForm.scss';
import MainButton from '../MainButton/MainButton'
import { IoMailOutline } from "react-icons/io5";
import { IoLockClosedOutline } from "react-icons/io5";
import { IoPawOutline } from "react-icons/io5";
import { GiFireflake } from "react-icons/gi";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { Stack } from '@mui/material';
import { Input } from '../Form/Input';
import { Link } from 'react-router-dom';

const RegisterForm: React.FC = () => {
	return (
		<Stack direction="row" justifyContent="center">
			<div className="auth-container register-form">
				<form action="#">
					<h2>Register</h2>
					<Input
						label="Username"
						icon={<HiOutlineUserCircle />}
						name="username"
						autoComplete="off"
						type="text"
						required
						/>
					<Input
						label="Email"
						icon={<IoMailOutline />}
						name="email"
						type="email"
						autoComplete="email"
						required
						/>
					{/* <div className="input-box">
						<select name="element" className="element">
							<option value="fire">fire</option>
							<option value="water">water</option>
							<option value="air">air</option>
							<option value="earth" selected>earth</option>
						</select>
						<label>Your favorite element:</label>
						<GiFireflake className="icon"/>
					</div> */}
					<Input
						label="Password"
						icon={<IoLockClosedOutline />}
						name="password"
						type="password"
						required
						/>
					<Input
						label="Confirm Password"
						icon={<IoPawOutline />}
						name="password_confirm"
						type="password"
						required
						/>
					<Stack direction="row" justifyContent="flex-start">
						<div className="remember-forgot">
							<input type="checkbox"/>I agree to the terms & conditions
						</div>
					</Stack>
					<MainButton buttonName="Register"/>
					<p className="or">or</p>
					<MainButton buttonName="42 Account" />
					<p>
						Already have an account ? <Link to="/auth/login">Login</Link>
					</p>
				</form>
			</div>
		</Stack>
	);
};

export default RegisterForm;