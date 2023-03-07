import React from 'react';

import classes from '../App/App.module.scss';
import { Task } from '../../ts/types';
import { Options } from '../App/handlers';
import { EditFormData, EditTask } from '../../ts/interfaces';
interface Props {
	handleEditTask: (
		e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
		options?: Options
	) => void;
	task: Task;
	toggleModal: () => void;
	setEditTask?: React.Dispatch<React.SetStateAction<EditTask>>;
	setX: (
		e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent
	) => string | null;
	setY: (
		e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent
	) => string | null;
	setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

const DescriptionReadOnly = ({
	handleEditTask,
	toggleModal,
	setEditTask,
	task,
	setX,
	setY,
	setEditFormData,
}: Props) => {
	return (
		<td
			data-id='description-cell'
			className={classes.description}
			onTouchStart={(event) =>
				handleEditTask(event, {
					toggleModal,
					setEditTask,
					task,
					setX,
					setY,
					setEditFormData,
				})
			}
			onClick={(event) =>
				handleEditTask(event, {
					toggleModal,
					setEditTask,
					task,
					setX,
					setY,
					setEditFormData,
				})
			}
			onKeyUp={(event) =>
				handleEditTask(event, {
					toggleModal,
					setEditTask,
					task,
					setX,
					setY,
					setEditFormData,
				})
			}
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

export default DescriptionReadOnly;
