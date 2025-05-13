import React from 'react';

import classes from './Button.module.scss';

interface Props {
	type: 'submit' | 'button' | 'reset' | undefined;
	children: React.ReactNode;
}

const ButtonGradient = ({ type, children }: Props) => {
	return (
		<button className={classes.buttonGradient} type={type}>
			{children}
		</button>
	);
};

export default ButtonGradient;
