import React, { ChangeEvent, RefObject, useRef, useEffect } from 'react';

import TableForm from './TableForm';
import AddTaskForm from './AddTaskForm';
import Card from './UI/Card/Card';
import classes from '../App.module.scss';
import { EditTask, EditFormData, ErrorsAndLoading } from '../ts/interfaces';
import { Task, TaskActionShape } from '../ts/types';
import { handleMenuItemEvent } from './UI/ContextMenu/handleMenuItemEvent';

interface Props {
	handleFormSubmit?: (e: React.FormEvent<Element>) => void;
	editTask: EditTask;
	showMenu?: boolean;
	outsideClickRef?: RefObject<HTMLTableSectionElement>;
	tasks: Task[];
	taskDispatch: React.Dispatch<TaskActionShape>;
	handleEditTask?: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	editFormData?: EditFormData;
	setEditTask?: React.Dispatch<React.SetStateAction<EditTask>>;
	handleEditFormChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	handleEditFormKeyboard?: (e: React.KeyboardEvent) => void;
	isModal?: boolean;
	setEditFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
	handleMenuItemEvent: typeof handleMenuItemEvent;
	handleAddFormChange: (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void;
	addFormData: EditFormData;
	setAddFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
	setState: React.Dispatch<React.SetStateAction<ErrorsAndLoading>>;
}

const Main = ({
	handleFormSubmit,
	editTask,
	showMenu,
	outsideClickRef,
	tasks,
	taskDispatch,
	handleEditTask,
	editFormData,
	setEditTask,
	handleEditFormChange,
	handleEditFormKeyboard,
	isModal,
	setEditFormData,
	handleMenuItemEvent,
	handleAddFormChange,
	addFormData,
	setAddFormData,
	setState,
}: Props) => {
	const priorityInput = useRef<HTMLInputElement>(null);

	useEffect(() => {
		editTask.inputType === 'priority-input' && priorityInput.current?.focus();
	}, [editTask.inputType, priorityInput]);

	return (
		<>
			<Card className={`${classes.card} card`}>
				<TableForm
					handleFormSubmit={handleFormSubmit}
					editTask={editTask}
					showMenu={showMenu}
					outsideClickRef={outsideClickRef}
					tasks={tasks}
					taskDispatch={taskDispatch}
					handleEditTask={handleEditTask}
					editFormData={editFormData}
					setEditTask={setEditTask}
					handleEditFormChange={handleEditFormChange}
					handleEditFormKeyboard={handleEditFormKeyboard}
					isModal={isModal}
					setEditFormData={setEditFormData}
					handleMenuItemEvent={handleMenuItemEvent}
				/>
				<AddTaskForm
					handleAddFormChange={handleAddFormChange}
					addFormData={addFormData}
					ref={priorityInput}
					taskDispatch={taskDispatch}
					setAddFormData={setAddFormData}
					editTask={editTask}
					setState={setState}
					isModal={isModal}
				/>
			</Card>
		</>
	);
};

export default Main;
