import React, { ChangeEvent, RefObject, useRef, useEffect } from 'react';

import TableForm from './TableForm';
import AddTaskForm from './AddTaskForm';
import Card from './UI/Card/Card';
import Modal from './UI/Modal/Modal';
import classes from '../App.module.scss';
import { EditTask, EditFormData, ErrorsAndLoading } from '../ts/interfaces';
import { Task, TaskActionShape } from '../ts/types';
import { handleMenuItemEvent } from './UI/ContextMenu/handleMenuItemEvent';
import { PriorityContext } from '../context/priority-context';

interface Props {
	handleFormSubmit?: (e: React.FormEvent<Element>) => void;
	editTask: EditTask;
	rowId?: string | null;
	inputType?: string | null;
	xPos?: string | null;
	yPos?: string | null;
	xPosTouch?: string | null;
	yPosTouch?: string | null;
	showMenu?: boolean;
	outsideClickRef?: RefObject<HTMLTableSectionElement>;
	tasks: Task[];
	taskDispatch: React.Dispatch<TaskActionShape>;
	handleEditTask?: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	editFormData: EditFormData;
	setEditTask?: React.Dispatch<React.SetStateAction<EditTask>>;
	handleEditFormChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	handleEditFormKeyboard?: (e: React.KeyboardEvent) => void;
	isModal?: boolean;
	setEditFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
	handleMenuItemEvent: typeof handleMenuItemEvent;
	handleAddFormChange: (
		e: ChangeEvent<Element> | React.FormEvent<HTMLFormElement>
	) => void;
	addFormData: EditFormData;
	setAddFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
	setState: React.Dispatch<React.SetStateAction<ErrorsAndLoading>>;
	onHide: (e: React.MouseEvent | React.TouchEvent | KeyboardEvent) => void;
}

const Main = ({
	handleFormSubmit,
	editTask,
	rowId,
	inputType,
	xPos,
	yPos,
	xPosTouch,
	yPosTouch,
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
	onHide,
}: Props) => {
	const priorityInput = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputType === 'priority-input' && priorityInput.current?.focus();
	}, [inputType, priorityInput]);

	return (
		<>
			{isModal &&
				(inputType === 'priority-cell' || inputType === 'priority-input') && (
					<PriorityContext.Provider
						value={{
							editTask: editTask,
							editFormData: editFormData,
							setEditFormData: setEditFormData,
							addFormData: addFormData,
							setAddFormData: setAddFormData,
							setState: setState,
							letterPriority:
								editTask.inputType === 'priority-cell'
									? editFormData.letterPriority
									: addFormData.letterPriority,
							numberPriority:
								editTask.inputType === 'priority-cell'
									? editFormData.numberPriority
									: addFormData.numberPriority,
							editMode: editTask.inputType,
							handleFormSubmit,
							handleAddFormChange,
							tasks: tasks,
							taskDispatch: taskDispatch,
							isModal: isModal,
						}}
					>
						<Modal onHide={(e) => onHide(e)} role='dialog' />
					</PriorityContext.Provider>
				)}
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
