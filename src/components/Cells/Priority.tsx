import React, { useRef, useEffect } from 'react';

import classes from '../App/App.module.scss';
import { Task } from '../../ts/types';
import { EditTask } from '../../ts/interfaces';
interface Props {
	handleEditTask: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	handleEditFormKeyboard: (e: React.KeyboardEvent) => void;
	task: Task;
	isModal: boolean;
	editTask: EditTask;
}

const Priority = ({
	handleEditTask,
	task,
	isModal,
	editTask,
	handleEditFormKeyboard,
}: Props) => {
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		task.id === editTask.rowId &&
			editTask.inputType === 'priority-cell' &&
			!isModal &&
			buttonRef.current?.focus();
	}, [editTask, task.id, isModal]);

	return (
		<td
			data-id='priority-cell'
			className={
				task.id === editTask.rowId && editTask.inputType === 'priority-cell'
					? `${classes.priority} ${classes.active}`
					: classes.priority
			}
		>
			<button
				data-id='priority-cell'
				aria-label='priority'
				onClick={(event) => handleEditTask(event, task)}
				onKeyUp={(event) => handleEditTask(event, task)}
				onKeyDown={(event) => handleEditFormKeyboard(event)}
				ref={buttonRef}
				className={task.status === 'Completed' ? classes.completed : ''}
			>
				{task.priority}
			</button>
		</td>
	);
};

export default Priority;
