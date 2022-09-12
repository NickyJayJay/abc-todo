import React, { ChangeEvent, RefObject } from 'react';

import EditableDescription from './Cells/EditableDescription';
import ReadOnlyStatus from './Cells/ReadOnlyStatus';
import ReadOnlyPriority from './Cells/ReadOnlyPriority';
import ReadOnlyDescription from './Cells/ReadOnlyDescription';
import ContextMenu from './UI/ContextMenu/ContextMenu';
import checkBox from '../assets/SVG/checkBox.svg';
import classes from '../App.module.scss';
import { EditTask, EditFormData } from '../ts/interfaces';
import { Task, TaskActionShape } from '../ts/types';

interface Props {
	handleFormSubmit: (e: React.FormEvent<Element>) => void;
	editTask: EditTask;
	outsideClickRef: RefObject<HTMLTableSectionElement>;
	tasks: Task[];
	taskDispatch: React.Dispatch<TaskActionShape>;
	handleEditTask: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	editFormData: EditFormData;
	setEditTask: React.Dispatch<React.SetStateAction<EditTask>>;
	handleEditFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleEditFormKeyboard: (e: React.KeyboardEvent) => void;
	isModal: boolean;
}

const TableForm = ({
	handleFormSubmit,
	editTask,
	outsideClickRef,
	tasks,
	taskDispatch,
	handleEditTask,
	editFormData,
	setEditTask,
	handleEditFormChange,
	handleEditFormKeyboard,
	isModal,
}: Props) => {
	return (
		<form onSubmit={handleFormSubmit}>
			{editTask.showMenu && (
				<ContextMenu
					xPos={editTask.xPos}
					yPos={editTask.yPos}
					editTask={editTask}
					tasks={tasks}
					taskDispatch={taskDispatch}
					editFormData={editFormData}
					setEditTask={setEditTask}
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
					{tasks.map((task) => (
						<tr key={task.id}>
							<ReadOnlyStatus
								task={task}
								handleEditTask={handleEditTask}
								editTask={editTask}
							/>
							<ReadOnlyPriority
								task={task}
								handleEditTask={handleEditTask}
								handleEditFormKeyboard={handleEditFormKeyboard}
								isModal={isModal}
								editTask={editTask}
							/>
							{editTask.inputType === 'description-cell' &&
							editTask.rowId === task.id ? (
								<EditableDescription
									handleEditFormChange={handleEditFormChange}
									handleFormSubmit={handleFormSubmit}
									handleEditFormKeyboard={handleEditFormKeyboard}
									taskId={task.id}
									rowId={editTask.rowId}
									inputType={editTask.inputType}
									taskDescription={editFormData.description}
								/>
							) : (
								<ReadOnlyDescription
									task={task}
									handleEditTask={handleEditTask}
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
