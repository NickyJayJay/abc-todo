import React from 'react';

import classes from './Button.module.scss';

interface Props {
	type: "submit" | "button" | "reset" | undefined;
	children: React.ReactNode;
	onClick: (event:React. MouseEvent) => void;
	disabled: boolean;
}

const Button = ({ type, onClick, children, disabled }: Props) => {
	return (
		<button
			className={classes.button}
			type={type || 'button'}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
