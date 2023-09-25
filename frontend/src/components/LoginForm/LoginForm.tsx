import React from 'react';
import './LoginForm.css';
import MainButton from '../MainButton/MainButton'
// import MainButton from '..MainButton/MainButton'
import { IoMailOutline } from "react-icons/io5";
import { IoLockClosedOutline } from "react-icons/io5";
import { Button } from '@mui/material';


const LoginForm: React.FC = () => {
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
							//   placeholder="email"
							autoComplete="email"
							required
							//   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							/>
							<IoMailOutline className="icon"/>
						</div>
						<div className="input-box">
							<label>Password</label>
							<input
							id="password"
							name="password"
							type="password"
							//   placeholder="email"
							// autoComplete="email"
							required
							//   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							/>
							<IoLockClosedOutline className="icon"/>
						</div>
						<div className="remember-forgot">
							<input type="checkbox"/>Remember me
							<a href="#">Forgot Password?</a>
						</div>
						<MainButton buttonName='login'/>
						{/* <button className='btn' >Login</button> */}
						<div className="input-box">
							<p>or</p>
						<MainButton buttonName='42 Account'/>
							{/* <button type="button" className="btn">42 Account</button> */}
						</div>
						<p>Don't have an account ? <a href="#" className="register-link">Register</a></p>
					</form>
				</div>
			</div>
            );
        };
					{/* <div className="input-box">
						<span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
						<input type="password" placeholder=" " required>
						<label>Password</label>
					</div>
					<div className="remember-forgot">
						<label><input type="checkbox">Remember me</label>
						<a href="#">Forgot Password?</a>
					</div>
					<div>
						<button type="submit" className="btn">Login</button>
					</div>
					<div className="input-box">
						<p>or</p>
						<button type="button" className="btn">42 Account</button>
						<!-- <span className="icon"><ion-icon name="mail-outline"></ion-icon></span>
						<input type="email" required>
						<label>Email</label> -->
					</div>
					<div className="login-register">
						<p>Don't have an account ? <a href="#" className="register-link">Register</a></p>
					</div> */}
				{/* </form> */}
			{/* </div> */}

        {/* // <div className=''>
        //     <button className='login' ></button>
        // </div> */}

export default LoginForm;