import React, { ChangeEvent, RefObject } from 'react';

import EditablePriority from './Cells/EditablePriority';
import EditableDescription from './Cells/EditableDescription';
import ReadOnlyStatus from './Cells/ReadOnlyStatus';
import ReadOnlyPriority from './Cells/ReadOnlyPriority';
import ReadOnlyDescription from './Cells/ReadOnlyDescription';
import ContextMenu from './UI/ContextMenu/ContextMenu';
import checkBox from '../assets/SVG/checkBox.svg';

import classes from '../App.module.scss';

interface Props {
	handleEditFormSubmit: (e: React.FormEvent<Element>) => void;
	editTask: EditTask;
	handleMenuItemClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
	outsideClickRef: RefObject<HTMLTableSectionElement>;
	tasks: Task[];
	handleEditTask: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	editFormData: EditFormData;
	handleEditFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleEditFormKeyboard: (e: React.KeyboardEvent) => void;
	isError: boolean;
}

interface EditTask {
	rowId: string | null;
	inputType: string | null | undefined;
	xPos?: string | null;
	yPos: string | null;
	xPosTouch: string | null;
	yPosTouch: string | null;
	showMenu: boolean;
}

type Task = {
	id: string | null;
	status: string | null | undefined;
	priority: string | null;
	description: string | null;
};

type EditFormData = {
	status: string | null;
	letterPriority: string;
	numberPriority: string;
	priority: string | null;
	description: string | null;
};

const TableForm = ({
	handleEditFormSubmit,
	editTask,
	handleMenuItemClick,
	outsideClickRef,
	tasks,
	handleEditTask,
	editFormData,
	handleEditFormChange,
	handleEditFormKeyboard,
	isError,
}: Props) => {
	return (
		<form onSubmit={handleEditFormSubmit}>
			{editTask.showMenu && (
				<ContextMenu
					xPos={editTask.xPos}
					yPos={editTask.yPos}
					handleMenuItemClick={handleMenuItemClick}
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
							{editTask.inputType === 'priority-cell' &&
							editTask.rowId === task.id ? (
								<EditablePriority
									taskPriority={editFormData.priority}
									handleEditFormChange={handleEditFormChange}
									handleEditFormSubmit={handleEditFormSubmit}
									handleEditFormKeyboard={handleEditFormKeyboard}
									taskId={task.id}
									isError={isError}
									rowId={editTask.rowId}
									inputType={editTask.inputType}
								/>
							) : (
								<ReadOnlyPriority task={task} handleEditTask={handleEditTask} />
							)}
							{editTask.inputType === 'description-cell' &&
							editTask.rowId === task.id ? (
								<EditableDescription
									handleEditFormChange={handleEditFormChange}
									handleEditFormSubmit={handleEditFormSubmit}
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
