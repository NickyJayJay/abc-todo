import React, { useRef, useEffect, ChangeEvent } from 'react';

import classes from '../../App.module.scss';

interface Props {
	taskPriority: string | null;
	handleEditFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleEditFormSubmit: (e: React.FormEvent) => void;
	handleEditFormKeyboard: (e: React.KeyboardEvent) => void;
	taskId: string | null;
	isError: boolean;
	rowId: string | null;
	inputType: string | null | undefined;
}

const EditablePriority = ({
	taskPriority,
	handleEditFormChange,
	handleEditFormSubmit,
	handleEditFormKeyboard,
	taskId,
	isError,
	rowId,
	inputType,
}: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		!isError && inputRef.current?.focus();
	});

	return (
		<td
			data-id='priority-cell'
			className={
				taskId === rowId && inputType === 'priority-cell'
					? `${classes.priority} ${classes.active}`
					: classes.priority
			}
		>
			<input
				type='text'
				name='priority'
				value={taskPriority as string}
				placeholder='ABC'
				onChange={(event) => handleEditFormChange(event)}
				onKeyDown={(event) => handleEditFormKeyboard(event)}
				onBlur={(event) => handleEditFormSubmit(event)}
				ref={inputRef}
			></input>
		</td>
	);
};

export default EditablePriority;
