import React from 'react';

import classes from '../../App.module.scss';
import { Task } from '../../ts/types';
interface Props {
	handleEditTask: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	handleEditFormKeyboard: (e: React.KeyboardEvent) => void;
	task: Task;
}

const ReadOnlyPriority = ({
	handleEditTask,
	handleEditFormKeyboard,
	task,
}: Props) => {
	return (
		<td
			data-id='priority-cell'
			className={classes.priority}
			onTouchStart={(event) => handleEditTask(event, task)}
			onClick={(event) => handleEditTask(event, task)}
			onKeyUp={(event) => handleEditTask(event, task)}
			onKeyDown={(event) => handleEditFormKeyboard(event)}
		>
			<button data-id='priority-cell'>{task.priority}</button>
		</td>
	);
};

export default ReadOnlyPriority;
