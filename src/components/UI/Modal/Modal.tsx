import React, { RefObject, useEffect, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import FocusLock from 'react-focus-lock';

import classes from './Modal.module.scss';
import Card from '../Card/Card';
import UpdateTaskPriority from '../../Cells/Error/UpdateTaskPriority';
import Close from '../../../assets/SVG/close.svg';

type EditFormData = {
		status: string | null,
		letterPriority: string,
		numberPriority: string,
		priority: string | null,
		description: string | null,
	}
interface Props {
	editFormData: EditFormData;
	addFormData: EditFormData;
	onHide: (e: React.MouseEvent | TouchEvent | KeyboardEvent) => void;
	onPriority: (e: React.MouseEvent<Element>) => void
	onLetter: (e: React.FormEvent<HTMLInputElement>) => void;
	onNumber: (e: React.FormEvent<HTMLInputElement>) => void;
	editMode: string;
	handleEditFormSubmit: (e: React.FormEvent<Element>) => void;
	handleAddFormChange: (e: ChangeEvent<Element> | React.FormEvent<HTMLFormElement>) => void;
	priorityInput: RefObject<HTMLInputElement>;
}

const Modal = ({
	editFormData,
	addFormData,
	onHide,
	onPriority,
	onLetter,
	onNumber,
	editMode,
	handleEditFormSubmit,
	handleAddFormChange,
	priorityInput,
}: Props) => {
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
							editMode === 'priority-input') && (
							<UpdateTaskPriority
								onPriority={onPriority}
								onLetter={onLetter}
								onNumber={onNumber}
								editMode={editMode}
								letterPriority={
									editMode === 'priority-cell'
										? editFormData.letterPriority
										: addFormData.letterPriority
								}
								numberPriority={
									editMode === 'priority-cell'
										? editFormData.numberPriority
										: addFormData.numberPriority
								}
								handleEditFormSubmit={handleEditFormSubmit}
								handleAddFormChange={handleAddFormChange}
							/>
						)}
					</FocusLock>
				</Card>,
				document.getElementById('overlay-root')!
			)}
		</>
	);
};

export default Modal;