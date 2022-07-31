import React, { RefObject, useEffect, useContext, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import FocusLock from 'react-focus-lock';

import { PriorityContext } from '../../../context/priority-context';
import classes from './Modal.module.scss';
import Card from '../Card/Card';
import UpdateTaskPriority from '../../Cells/Error/UpdateTaskPriority';
import Close from '../../../assets/SVG/close.svg';

type Props = {
	onHide: (e: React.MouseEvent | TouchEvent | KeyboardEvent) => void;
};

const Modal = ({ onHide }: Props) => {
	const { editMode, priorityInput } = useContext(PriorityContext);

	useEffect(() => {
		editMode === 'priority-input' && priorityInput.current?.focus();
	}, []);

	return (
		<>
			{ReactDOM.createPortal(
				<div className={classes.backdrop} onClick={(e) => onHide(e)}></div>,
				document.getElementById('backdrop-root')!
			)}
			{ReactDOM.createPortal(
				<Card className={`${classes.modal} ${classes.active}`}>
					<FocusLock returnFocus>
						<button
							className={classes.closeModal}
							tab-index='0'
							onClick={(e) => onHide(e)}
						>
							<img src={Close} alt='close icon' />
						</button>
						{(editMode === 'priority-cell' ||
							editMode === 'priority-input') && <UpdateTaskPriority />}
					</FocusLock>
				</Card>,
				document.getElementById('overlay-root')!
			)}
		</>
	);
};

export default Modal;
