import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import FocusLock from 'react-focus-lock';

import classes from '../components/UI/Modal/Modal.module.scss';
import Card from '../components/UI/Card/Card';
import Close from '../assets/SVG/close.svg';

type Props = {
	children: React.ReactNode;
	role?: string;
	hideModalHandler: (
		e: React.MouseEvent | React.TouchEvent | KeyboardEvent
	) => void;
};

type ReturnType = [React.ElementType, () => void, boolean];

const useModal = (): ReturnType => {
	const [isModal, setModal] = useState(false);

	const toggleModal = () => {
		setModal(!isModal);
	};

	const Modal = useCallback(({ children, role, hideModalHandler }: Props) => {
		return (
			<>
				{ReactDOM.createPortal(
					<div
						className={classes.backdrop}
						onClick={(e) => hideModalHandler(e)}
						onTouchStart={(e) => hideModalHandler(e)}
					></div>,
					document.getElementById('backdrop-root')!
				)}
				{ReactDOM.createPortal(
					<Card className={`${classes.modal} ${classes.active}`} role={role}>
						<FocusLock returnFocus>
							<button
								className={classes.closeModal}
								tab-index='0'
								onClick={(e) => hideModalHandler(e)}
								onTouchStart={(e) => hideModalHandler(e)}
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
	}, []);

	return [Modal, toggleModal, isModal];
};

export default useModal;
