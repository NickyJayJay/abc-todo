import React from 'react';

import classes from '../../App.module.scss';
import { Task } from '../../ts/types';
interface Props {
	handleEditTask: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	task: Task;
}

const ReadOnlyPriority = ({ handleEditTask, task }: Props) => {
	return (
		<td
			data-id='priority-cell'
			className={classes.priority}
			onTouchStart={(event) => handleEditTask(event, task)}
			onClick={(event) => handleEditTask(event, task)}
			onKeyUp={(event) => handleEditTask(event, task)}
		>
			<button data-id='priority-cell'>{task.priority}</button>
		</td>
	);
};

export default ReadOnlyPriority;
