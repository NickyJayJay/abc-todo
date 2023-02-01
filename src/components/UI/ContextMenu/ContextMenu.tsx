import React from 'react';
import FocusLock from 'react-focus-lock';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove, update } from 'firebase/database';
import { firebaseConfig } from '../../../firebaseConfig';

import classes from './ContextMenu.module.scss';
import checkmark from '../../../assets/SVG/checkmark-green.svg';
import add from '../../../assets/SVG/add.svg';
import arrowRight from '../../../assets/SVG/arrow-right.svg';
import dot from '../../../assets/SVG/dot.svg';
import trash from '../../../assets/SVG/trash.svg';
import close from '../../../assets/SVG/close-regular.svg';
import { Task, TaskActionShape } from '../../../ts/types';
import { EditTask, EditFormData } from '../../../ts/interfaces';
import sortList from '../../../utilities/sortList';
import { handleMenuItemEvent } from './handleMenuItemEvent';
import Button from '../Button/Button';

interface Props {
	xPos?: string | null;
	yPos?: string | null;
	editTask: EditTask;
	rowId?: string | null;
	tasks: Task[];
	taskDispatch: React.Dispatch<TaskActionShape>;
	editFormData: EditFormData;
	setEditTask: React.Dispatch<React.SetStateAction<EditTask>>;
	setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
	handleMenuItemEvent: typeof handleMenuItemEvent;
}

// Initialize Firebase and set bindings
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ContextMenu = ({
	xPos,
	yPos,
	editTask,
	rowId,
	tasks,
	taskDispatch,
	editFormData,
	setEditTask,
	setEditFormData,
	handleMenuItemEvent,
}: Props) => {
	return (
		<FocusLock returnFocus>
			<div
				role='menu'
				className={`${classes.contextMenu} card`}
				style={{
					top: yPos as string,
					left: xPos as string,
				}}
			>
				<ul onTouchStart={(event) => event.stopPropagation()}>
					<li role='menuitem'>
						<Button
							onClick={handleMenuItemEvent({
								editTask,
								rowId,
								setEditTask,
								editFormData,
								setEditFormData,
								sortList,
								tasks,
								taskDispatch,
								ref,
								db,
								update,
								remove,
							})}
						>
							<span>In Process</span>
							<img src={dot} alt='in process icon' />
						</Button>
					</li>
					<li role='menuitem'>
						<Button
							onClick={handleMenuItemEvent({
								editTask,
								rowId,
								setEditTask,
								editFormData,
								setEditFormData,
								sortList,
								tasks,
								taskDispatch,
								ref,
								db,
								update,
								remove,
							})}
						>
							<span className={classes.completed}>Completed</span>
							<img src={checkmark} alt='completed icon' />
						</Button>
					</li>
					<li role='menuitem'>
						<Button
							onClick={handleMenuItemEvent({
								editTask,
								rowId,
								setEditTask,
								editFormData,
								setEditFormData,
								sortList,
								tasks,
								taskDispatch,
								ref,
								db,
								update,
								remove,
							})}
						>
							<span>Forwarded</span>
							<img src={arrowRight} alt='forwarded icon' />
						</Button>
					</li>
					<li role='menuitem'>
						<Button
							onClick={handleMenuItemEvent({
								editTask,
								rowId,
								setEditTask,
								editFormData,
								setEditFormData,
								sortList,
								tasks,
								taskDispatch,
								ref,
								db,
								update,
								remove,
							})}
						>
							<span>Delegated</span>
							<img src={add} alt='delegated icon' />
						</Button>
					</li>
					<li role='menuitem'>
						<Button
							onClick={handleMenuItemEvent({
								editTask,
								rowId,
								setEditTask,
								editFormData,
								setEditFormData,
								sortList,
								tasks,
								taskDispatch,
								ref,
								db,
								update,
								remove,
							})}
						>
							<span>Remove</span>
							<img src={trash} alt='removed icon' />
						</Button>
					</li>
					<li role='menuitem'>
						<Button
							onClick={handleMenuItemEvent({
								editTask,
								rowId,
								setEditTask,
								editFormData,
								setEditFormData,
								sortList,
								tasks,
								taskDispatch,
								ref,
								db,
								update,
								remove,
							})}
						>
							<span>Cancel</span>
							<img src={close} alt='close icon' />
						</Button>
					</li>
				</ul>
			</div>
		</FocusLock>
	);
};

export default ContextMenu;
