import React from 'react';

import classes from '../App/App.module.scss';
import { Task } from '../../ts/types';
interface Props {
	handleEditTask: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	task: Task;
}

const ReadOnlyDescription = ({ handleEditTask, task }: Props) => {
	return (
		<td
			data-id='description-cell'
			className={classes.description}
			onTouchStart={(event) => handleEditTask(event, task)}
			onClick={(event) => handleEditTask(event, task)}
			onKeyUp={(event) => handleEditTask(event, task)}
		>
			<button
				data-id='description-cell'
				aria-label='description'
				className={task.status === 'Completed' ? classes.completed : ''}
			>
				{task.description}
			</button>
		</td>
	);
};

export default ReadOnlyDescription;
