import React, { useEffect, useRef, ChangeEvent } from 'react';

import classes from '../../App.module.scss';

interface Props {
	handleEditFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleFormSubmit: (e: React.FormEvent) => void;
	handleEditFormKeyboard: (e: React.KeyboardEvent) => void;
	taskId: string | null;
	rowId: string | null;
	inputType: string | null | undefined;
	taskDescription: string | null;
}

const EditableDescription = ({
	handleEditFormChange,
	taskId,
	handleFormSubmit,
	handleEditFormKeyboard,
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
				value={taskDescription as string}
				onChange={(event) => handleEditFormChange(event)}
				onKeyDown={(event) => handleEditFormKeyboard(event)}
				onBlur={(event) => handleFormSubmit(event)}
				ref={inputRef}
				maxLength={150}
			></input>
		</td>
	);
};

export default EditableDescription;
