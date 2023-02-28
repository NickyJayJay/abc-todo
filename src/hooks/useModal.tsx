import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import FocusLock from 'react-focus-lock';

import classes from '../components/UI/Modal/Modal.module.scss';
import Card from '../components/UI/Card/Card';
import Close from '../assets/SVG/close.svg';

type Props = {
	children: React.ReactNode;
	role?: string;
};

type ReturnType = [React.ElementType, (input: boolean) => void, boolean];

const useModal = (): ReturnType => {
	const [isModal, setModal] = useState(false);

	const toggleModal = (input: boolean) => {
		setModal(input);
	};

	const Modal = ({ children, role }: Props) => {
		return (
			<>
				{ReactDOM.createPortal(
					<div
						className={classes.backdrop}
						onClick={() => toggleModal(false)}
						onTouchStart={() => toggleModal(false)}
					></div>,
					document.getElementById('backdrop-root')!
				)}
				{ReactDOM.createPortal(
					<Card className={`${classes.modal} ${classes.active}`} role={role}>
						<FocusLock returnFocus>
							<button
								className={classes.closeModal}
								tab-index='0'
								onClick={() => toggleModal(false)}
								onTouchStart={() => toggleModal(false)}
							>
								<img src={Close} alt='close icon' />
							</button>
							{children}
						</FocusLock>
					</Card>,
					document.getElementById('overlay-root')!
				)}
			</>
		);
	};

	return [Modal, toggleModal, isModal];
};

export default useModal;
