import React from 'react';
import './RegisterForm.css';
import MainButton from '../MainButton/MainButton'
import { IoMailOutline } from "react-icons/io5";
import { IoLockClosedOutline } from "react-icons/io5";
import { IoPawOutline } from "react-icons/io5";
import { GiFireflake } from "react-icons/gi";
import { HiOutlineUserCircle } from "react-icons/hi2";



const RegisterForm: React.FC = () => {
	return (
		<div className="register-wrapper">
			<div className="box-popup">
				<form action="#">
					<h2>Register</h2>
					<div className="input-box">
						<input type="text" required />
						<label>Username</label>
						<HiOutlineUserCircle className="icon"/>
					</div>
					<div className="input-box">
						<select name="element" className="element">
							<option value="fire">fire</option>
							<option value="water">water</option>
							<option value="air">air</option>
							<option value="earth" selected>earth</option>
						</select>
						<label>Your favorite element:</label>
						<GiFireflake className="icon"/>
					</div>
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
					<div className="input-box">
						<label>Confirm Password</label>
						<input
						id="password"
						name="password"
						type="password"
						required/>
						<IoPawOutline className="icon"/>
					</div>
					<div className="remember-forgot">
						<input type="checkbox"/>I agree to the terms & conditions
					</div>
					<MainButton buttonName='Register'/>
					<div className="input-box">
						<p>or</p>
					<MainButton buttonName='42 Account'/>
					</div>
					<p>Already have an account ? <a href="#" className="register-link">Login</a></p>
				</form>
			</div>
		</div>
	);
};

export default RegisterForm;