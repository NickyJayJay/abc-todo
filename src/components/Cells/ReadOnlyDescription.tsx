import React from 'react';

import classes from '../../App.module.scss';
import { LoadedTask } from '../../ts/types';
interface Props {
	handleEditTask: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: LoadedTask
	) => void;
	task: LoadedTask;
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
			<button data-id='description-cell'>{task.description}</button>
		</td>
	);
};

export default ReadOnlyDescription;
