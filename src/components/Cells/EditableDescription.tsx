import React, { useEffect, useRef } from 'react';

import classes from '../App/App.module.scss';
import { handleEditFormChange } from '../TableForm/handlers';
import { EditFormData } from '../../ts/interfaces';

interface Props {
	handleFormSubmit: (e: React.FormEvent) => void;
	handleEditFormKeyboard: (e: React.KeyboardEvent) => void;
	setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
	editFormData: EditFormData;
	taskId?: string | null;
	rowId?: string | null;
	inputType?: string | null;
	taskDescription?: string | null;
}

const EditableDescription = ({
	taskId,
	handleFormSubmit,
	handleEditFormKeyboard,
	setEditFormData,
	editFormData,
	rowId,
	inputType,
	taskDescription,
}: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	});

	return (
		<td
			data-id='description-cell'
			className={
				taskId === rowId && inputType === 'description-cell'
					? `${classes.description} ${classes.active}`
					: classes.description
			}
		>
			<input
				type='text'
				placeholder='Enter a task description...'
				name='description'
				aria-label='description'
				value={taskDescription as string}
				onChange={handleEditFormChange({
					editFormData,
					setEditFormData,
				})}
				onKeyDown={(event) => handleEditFormKeyboard(event)}
				onBlur={(event) => handleFormSubmit(event)}
				ref={inputRef}
				maxLength={150}
			></input>
		</td>
	);
};

export default EditableDescription;
