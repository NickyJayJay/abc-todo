import React, { useEffect, useRef } from 'react';

import classes from '../App/App.module.scss';
import { handleEditFormChange } from '../TableForm/handlers';
import { EditFormData, EditTask } from '../../ts/interfaces';
import { Options } from '../App/handlers';
import { Task, TaskActionShape } from '../../ts/types';

interface Props {
	handleFormSubmit: (options: Options) => (e: React.FormEvent) => void;
	handleEditFormKeyboard: (e: React.KeyboardEvent) => void;
	setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
	editFormData: EditFormData;
	taskId?: string | null;
	rowId?: string | null;
	inputType?: string | null;
	taskDescription?: string | null;
	editTask: EditTask;
	tasks: Task[];
	taskDispatch: React.Dispatch<TaskActionShape>;
}

const DescriptionEditable = ({
	taskId,
	handleFormSubmit,
	handleEditFormKeyboard,
	setEditFormData,
	editFormData,
	rowId,
	inputType,
	taskDescription,
	editTask,
	tasks,
	taskDispatch,
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
				onBlur={handleFormSubmit({
					editTask,
					editFormData,
					tasks,
					taskDispatch,
				})}
				ref={inputRef}
				maxLength={150}
			></input>
		</td>
	);
};

export default DescriptionEditable;
