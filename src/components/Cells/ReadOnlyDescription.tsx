import React from 'react';

import classes from '../../App.module.scss';

type Task = {
	id: string | null;
	status: string | null | undefined;
	priority: string | null;
	description: string | null;
};

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
			<button data-id='description-cell'>{task.description}</button>
		</td>
	);
};

export default ReadOnlyDescription;
