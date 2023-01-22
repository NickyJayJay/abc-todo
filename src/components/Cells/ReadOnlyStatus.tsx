import React, { useRef, useEffect } from 'react';

import classes from '../App/App.module.scss';
import checkmark from '../../assets/SVG/checkmark.svg';
import add from '../../assets/SVG/add.svg';
import arrowRight from '../../assets/SVG/arrow-right.svg';
import dot from '../../assets/SVG/dot.svg';
import { Task } from '../../ts/types';
import { EditTask } from '../../ts/interfaces';
interface Props {
	handleEditTask: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	task: Task;
	editTask: EditTask;
}

const ReadOnlyStatus = ({ handleEditTask, task, editTask }: Props) => {
	const cellRef = useRef<HTMLTableCellElement>(null);

	useEffect(() => {
		task.id === editTask.rowId &&
			editTask.inputType === 'status-cell' &&
			!editTask.showMenu &&
			cellRef.current?.focus();
	}, [editTask, task.id]);

	return (
		<td
			data-id='status-cell'
			className={
				task.id === editTask.rowId && editTask.inputType === 'status-cell'
					? `${classes.status} ${classes.active}`
					: classes.status
			}
			ref={cellRef}
		>
			<button
				data-id='status-cell'
				aria-label='status'
				onClick={(event) => handleEditTask(event, task)}
				onKeyDown={(event) => handleEditTask(event, task)}
			>
				{task.status === 'In Process' && (
					<img src={dot} alt='in process icon' data-id='status-cell' />
				)}
				{task.status === 'Completed' && (
					<img src={checkmark} alt='completed icon' data-id='status-cell' />
				)}
				{task.status === 'Forwarded' && (
					<img src={arrowRight} alt='forwarded icon' data-id='status-cell' />
				)}
				{task.status === 'Delegated' && (
					<img src={add} alt='delegated icon' data-id='status-cell' />
				)}
			</button>
		</td>
	);
};

export default ReadOnlyStatus;
