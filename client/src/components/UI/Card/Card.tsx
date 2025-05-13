import React from 'react';

import classes from './Card.module.scss';

interface Props {
	className: string | null;
	children: React.ReactNode;
	role?: string;
}

const Card = ({ className, children, role }: Props) => {
	return (
		<div className={`${classes.card} ${className}`} role={role}>
			{children}
		</div>
	);
};

export default Card;
