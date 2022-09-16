import React, { useRef, useEffect } from 'react';

import classes from '../../App.module.scss';
import { Task } from '../../ts/types';
import { EditTask } from '../../ts/interfaces';
interface Props {
	handleEditTask: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	task: Task;
	isError: boolean;
	editTask: EditTask;
}

const ReadOnlyPriority = ({
	handleEditTask,
	task,
	isError,
	editTask,
}: Props) => {
	const cellRef = useRef<HTMLTableCellElement>(null);

	useEffect(() => {
		task.id === editTask.rowId && !isError && cellRef.current?.focus();
	}, [editTask, task.id, isError]);

	return (
		<td
			data-id='priority-cell'
			className={classes.priority}
			onClick={(event) => handleEditTask(event, task)}
			onKeyUp={(event) => handleEditTask(event, task)}
			ref={cellRef}
		>
			<button data-id='priority-cell'>{task.priority}</button>
		</td>
	);
};

export default ReadOnlyPriority;
