import React from 'react';
import FocusLock from 'react-focus-lock';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove, update } from 'firebase/database';
import { firebaseConfig } from '../../../firebaseConfig';

import classes from './ContextMenu.module.scss';
import checkmark from '../../../assets/SVG/checkmark.svg';
import add from '../../../assets/SVG/add.svg';
import arrowRight from '../../../assets/SVG/arrow-right.svg';
import dot from '../../../assets/SVG/dot.svg';
import trash from '../../../assets/SVG/trash.svg';
import close from '../../../assets/SVG/close-regular.svg';
import { Task, TaskActionShape } from '../../../ts/types';
import { EditTask, EditFormData } from '../../../ts/interfaces';
import { TaskActionType } from '../../../ts/enums';

interface Props {
	xPos?: string | null;
	yPos?: string | null;
	editTask: EditTask;
	tasks: Task[];
	taskDispatch: React.Dispatch<TaskActionShape>;
	editFormData: EditFormData;
	setEditTask: React.Dispatch<React.SetStateAction<EditTask>>;
}

// Initialize Firebase and set bindings
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ContextMenu = ({
	xPos,
	yPos,
	editTask,
	tasks,
	taskDispatch,
	editFormData,
	setEditTask,
}: Props) => {
	const handleDeleteChange = (taskId: EditTask['rowId']) => {
		const index = tasks.findIndex((task) => task.id === taskId);

		taskDispatch({
			type: TaskActionType.REMOVE,
			index: index,
		});
		const dbRef = ref(db, `tasks/${taskId}`);
		remove(dbRef);
	};

	const handleMenuItemEvent = (
		e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent
	) => {
		e.stopPropagation();
		if (
			(e as React.KeyboardEvent).key === 'Tab' ||
			(e as React.KeyboardEvent).key === 'Shift'
		)
			return;
		let menuValue;

		if (e.type === 'click' && (e.target as HTMLElement).tagName === 'SPAN') {
			menuValue = (e.target as HTMLElement).textContent;
		} else if (
			e.type === 'click' &&
			(e.target as HTMLElement).tagName === 'IMG'
		) {
			menuValue = (e.target as HTMLElement).previousElementSibling?.textContent;
		} else {
			menuValue = (e.target as HTMLElement).childNodes[0].textContent;
		}

		const editedTask: Task = {
			id: editTask.rowId,
			status: menuValue || null,
			priority: editFormData.priority,
			description: editFormData.description,
		};

		if (menuValue === 'Remove') {
			handleDeleteChange(editTask.rowId);
			setEditTask({ ...editTask, showMenu: false });
			return;
		}

		if (menuValue === 'Cancel') {
			setEditTask({ ...editTask, showMenu: false });
			return;
		}

		const newTasks = [...tasks];
		const index = tasks.findIndex((task) => task.id === editTask.rowId);
		newTasks[index] = editedTask;
		taskDispatch({
			type: TaskActionType.SET,
			data: newTasks,
		});
		const dbRef = ref(db, `tasks/${editTask.rowId}`);
		update(dbRef, editedTask);

		setEditTask({ ...editTask, showMenu: false });
	};

	return (
		<FocusLock returnFocus>
			<div
				className={`${classes.contextMenu} card`}
				style={{
					top: yPos as string,
					left: xPos as string,
				}}
			>
				<ul>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>In Process</span>
							<img src={dot} alt='in process icon' />
						</button>
					</li>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>Completed</span>
							<img src={checkmark} alt='completed icon' />
						</button>
					</li>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>Forwarded</span>
							<img src={arrowRight} alt='forwarded icon' />
						</button>
					</li>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>Delegated</span>
							<img src={add} alt='delegated icon' />
						</button>
					</li>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>Remove</span>
							<img src={trash} alt='removed icon' />
						</button>
					</li>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>Cancel</span>
							<img src={close} alt='close icon' />
						</button>
					</li>
				</ul>
			</div>
		</FocusLock>
	);
};

export default ContextMenu;
