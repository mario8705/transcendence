import React, { useCallback, useState, useRef, PropsWithChildren, useContext, Children } from 'react';
import MainButton from '../MainButton/MainButton'
import { IoMailOutline } from "react-icons/io5";
import { HiOutlineArrowCircleLeft } from "react-icons/hi";
import { BsQrCode } from "react-icons/bs";
import { FaCommentSms } from "react-icons/fa6";
import { SiLetsencrypt } from "react-icons/si";
import { Stack, styled } from '@mui/material';
import './DoubleAuth.css';

enum AuthenticationMode {
	Email = 'email',
	Sms = 'sms',
	QrCode = 'qrcode',
	AuthCode = 'otp',
};

const Spacer = styled('p')({
	marginTop: '1em',
	marginBottom: '1em',
	lineHeight: '1em',
	fontSize: '1em',
});

type AuthenticationMethodDescriptorTable = {
	[k in typeof AuthenticationMode[keyof typeof AuthenticationMode]]: {
		icon: React.ReactNode,
		name: string;
		title: string;
	};
};

const methodsList: AuthenticationMethodDescriptorTable = {
	[AuthenticationMode.AuthCode]: {
		icon: <SiLetsencrypt className="icon" />,
		name: 'Code',
		title: 'Open your app and enter the Code',
	},
	[AuthenticationMode.Sms]: {
		icon: <FaCommentSms className="icon" />,
		name: 'SMS',
		title: 'Enter the code you received by SMS',
	},
	[AuthenticationMode.QrCode]: {
		icon: <BsQrCode className="icon" />,
		name: 'QR Code',
		title: 'Open your app and enter the Code',
	},
	[AuthenticationMode.Email]: {
		icon: <IoMailOutline className="icon" />,
		name: 'Email',
		title: 'Enter the code you received in your Email',
	},
};

export type AuthMethodPickerProps = {
	methods: string[];
	onMethodPicked: (method: string) => void;
};

export const AuthMethodPicker: React.FC<AuthMethodPickerProps> = ({ methods, onMethodPicked }) => {
	const methodsComponents = React.useMemo(() => {
		return Object.entries(methodsList).filter(([ key ]) => methods.includes(key)).map(([ key, { icon, name } ], index) => (
			<React.Fragment key={key}>
				{index > 0 && <Spacer>or</Spacer>}
				<MainButton icon={icon} buttonName={name} onClick={() => onMethodPicked(key)} />
			</React.Fragment>
		));
	}, [ methods ]);

	return (
		<Stack direction="column">
			<h2>Two-Factor Authentication Required</h2>
			{methodsComponents}
		</Stack>
	);
}


export type AuthenticationPanelProps = {
	authenticationMode: AuthenticationMode;
	onBack: () => void;
}

export const AuthenticationPanel: React.FC<PropsWithChildren<AuthenticationPanelProps>> = ({ children, authenticationMode, onBack }) => {
	const { title } = methodsList[authenticationMode];
	const [ cooldownTime, setCooldownTime ] = React.useState<number>(0);

	/* XXX Interval is reset every 1s but it still works nontheless... */
	React.useEffect(() => {
		const id = setInterval(() => {
			if (cooldownTime > 0) {
				setCooldownTime(cooldownTime => cooldownTime - 1);
			}
		}, 1000);
		return () => clearInterval(id);
	}, [ setCooldownTime, cooldownTime ]);

	const sendAgain = React.useCallback(() => {
		if (cooldownTime === 0) {
			setCooldownTime(30);
			console.log('Sending');
		}
	}, [ setCooldownTime, cooldownTime ]);

	return (
		<>
			<span className="icon-close" onClick={onBack}>
				<HiOutlineArrowCircleLeft />
			</span>
			<form action="#">
				<h2 className='h2bis'>{title}</h2>
				<CodeInput length={6} onChange={() => 0} />
				<div className="remember-forgot">
					<p className='pbis'>
						Didn't have time to receive code?
						<a href="#" onClick={sendAgain}>Send Again{cooldownTime > 0 ? ` (${cooldownTime}s)` : ''}</a>
					</p>
				</div>
				<div className="input-box">
					<MainButton buttonName='Submit'/>
				</div>
			</form>
		</>
	);
}

type CodeInputProps = {
	length: number;
	// value: string;
	onChange: (x: string) => void;
};

const DigitInput = styled('input')({
	'&': {
		width: '2em',
		height: '2em',
		caretColor: 'transparent',
	},
	'&:focus': {
		boxShadow: '0 0 0 4px rgba(191, 156, 232, 0.8)',
	},
});
/*
	const validatedOnce = React.useRef<boolean>(false); /* Only validate automatically on the first attempt */

const CodeInput: React.FC<CodeInputProps> = ({ length, onChange }) => {
	const frozenLength = React.useMemo(() => length, []);
	const [ inputs, setInputs ] = React.useState(() => new Array(frozenLength).fill(''));
	const inputRefs = useRef(inputs.map(() => React.createRef<HTMLInputElement>()));

	const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const newInputs = [...inputs];
		let i;

		const transformedValue = value.trim().substring(0, frozenLength - index);

		for (i = 0; i < transformedValue.length; ++i) {
			if (!/^[0-9]+$/.test(transformedValue[i]))
				break ;

			newInputs[index + i] = transformedValue[i];
		}

		inputRefs.current[Math.min(frozenLength - 1, index + i)].current?.focus();

		if (i > 0) {
			setInputs(newInputs);
			onChange(newInputs.join(''));
		}
	};

	const handleKeyDown = (index: number) => ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
		if (key === 'Backspace') {
			setInputs(inputs => {
				const newInputs = [...inputs];
				newInputs[index] = '';
				return newInputs;
			})
			if (index > 0) {
				inputRefs.current[index - 1].current?.focus();
			}
		} else if (key === 'ArrowLeft') {
			if (index > 0) {
				inputRefs.current[index - 1].current?.focus();
			}
		} else if (key === 'ArrowRight') {
			if (index + 1 < frozenLength) {
				inputRefs.current[index + 1].current?.focus();
			}
		}
	};

	return (
		<div className="input-box mfa">
			{
				inputs.map((input, index) => (
					<DigitInput
						key={index}
						type="text"
						value={input}
						onChange={handleChange(index)}
						onKeyDown={handleKeyDown(index)}
						ref={inputRefs.current[index]}
					/>
				))
			}
		</div>
	);
}
