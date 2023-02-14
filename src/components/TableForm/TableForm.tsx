import React, { RefObject } from 'react';

import EditableDescription from '../Cells/DescriptionEditable';
import Status from '../Cells/Status';
import Priority from '../Cells/Priority';
import ReadOnlyDescription from '../Cells/DescriptionReadOnly';
import ContextMenu from '../UI/ContextMenu/ContextMenu';
import checkBox from '../../assets/SVG/checkBox.svg';
import classes from '../App/App.module.scss';
import { EditTask, EditFormData } from '../../ts/interfaces';
import { Task, TaskActionShape } from '../../ts/types';
import { handleMenuItemEvent } from '../UI/ContextMenu/handleMenuItemEvent';

interface Props {
	handleFormSubmit?: (e: React.FormEvent<Element>) => void;
	editTask: EditTask;
	xPos?: string | null;
	yPos?: string | null;
	rowId?: string | null;
	showMenu?: boolean;
	outsideClickRef?: RefObject<HTMLTableSectionElement>;
	tasks: Task[];
	taskDispatch?: React.Dispatch<TaskActionShape>;
	handleEditTask?: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	editFormData: EditFormData;
	setEditTask?: React.Dispatch<React.SetStateAction<EditTask>>;
	handleEditFormKeyboard?: (e: React.KeyboardEvent) => void;
	isModal?: boolean;
	setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
	handleMenuItemEvent: typeof handleMenuItemEvent;
}

const TableForm = ({
	handleFormSubmit,
	editTask,
	xPos,
	yPos,
	rowId,
	showMenu,
	outsideClickRef,
	tasks,
	taskDispatch,
	handleEditTask,
	editFormData,
	setEditTask,
	handleEditFormKeyboard,
	isModal,
	setEditFormData,
	handleMenuItemEvent,
}: Props) => {
	return (
		<form onSubmit={handleFormSubmit}>
			{showMenu && (
				<ContextMenu
					xPos={xPos}
					yPos={yPos}
					rowId={rowId}
					editTask={editTask}
					tasks={tasks}
					taskDispatch={taskDispatch!}
					editFormData={editFormData!}
					setEditTask={setEditTask!}
					setEditFormData={setEditFormData!}
					handleMenuItemEvent={handleMenuItemEvent}
				/>
			)}
			<table>
				<thead>
					<tr>
						<th className={classes.statusTitle}>
							<img src={checkBox} alt='status icon' />
						</th>
						<th className={classes.priorityTitle}>ABC</th>
						<th className={classes.descriptionTitle}>Prioritized Task List</th>
					</tr>
				</thead>
				<tbody ref={outsideClickRef}>
					{tasks!.map((task) => (
						<tr
							key={task.id}
							className={task.status === 'Completed' ? classes.completed : ''}
						>
							<Status
								task={task}
								handleEditTask={handleEditTask!}
								editTask={editTask!}
							/>
							<Priority
								task={task}
								handleEditTask={handleEditTask!}
								handleEditFormKeyboard={handleEditFormKeyboard!}
								isModal={isModal!}
								editTask={editTask!}
							/>
							{editTask!.inputType === 'description-cell' &&
							rowId === task.id ? (
								<EditableDescription
									handleFormSubmit={handleFormSubmit!}
									handleEditFormKeyboard={handleEditFormKeyboard!}
									taskId={task.id}
									rowId={rowId}
									inputType={editTask!.inputType}
									taskDescription={editFormData!.description}
									editFormData={editFormData}
									setEditFormData={setEditFormData}
								/>
							) : (
								<ReadOnlyDescription
									task={task}
									handleEditTask={handleEditTask!}
								/>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</form>
	);
};

export default TableForm;
