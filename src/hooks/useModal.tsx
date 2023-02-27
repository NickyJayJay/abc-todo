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

const useModal = () => {
	const [isModal, setModal] = useState(false);

	const toggleModal = () => {
		setModal(!isModal);
	};

	const modalContent = ({ children, role }: Props) => {
		return (
			<>
				{ReactDOM.createPortal(
					<div
						className={classes.backdrop}
						onClick={() => toggleModal()}
						onTouchStart={() => toggleModal()}
					></div>,
					document.getElementById('backdrop-root')!
				)}
				{ReactDOM.createPortal(
					<Card className={`${classes.modal} ${classes.active}`} role={role}>
						<FocusLock returnFocus>
							<button
								className={classes.closeModal}
								tab-index='0'
								onClick={() => toggleModal()}
								onTouchStart={() => toggleModal()}
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

	const Modal = () => {
		return isModal ? modalContent : null;
	};

	return [Modal, toggleModal, isModal];
};

export default useModal;
