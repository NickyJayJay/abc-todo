import React, { RefObject, useRef, useEffect } from 'react';

import TableForm from '../TableForm/TableForm';
import AddTaskForm from '../AddTaskForm/AddTaskForm';
import Card from '../UI/Card/Card';
import classes from '../App/App.module.scss';
import { EditTask, EditFormData, ErrorsAndLoading } from '../../ts/interfaces';
import { Task, TaskActionShape } from '../../ts/types';
import { handleMenuItemEvent } from '../UI/ContextMenu/handleMenuItemEvent';
import { PriorityContext } from '../../context/priority-context';
import UpdateTaskPriority from '../UpdateTaskPriority/UpdateTaskPriority';
import useModal from '../../hooks/useModal';
interface Props {
	handleFormSubmit?: (e: React.FormEvent<Element>) => void;
	editTask: EditTask;
	rowId?: string | null;
	inputType?: string | null;
	xPos?: string | null;
	yPos?: string | null;
	showMenu?: boolean;
	tableRef: RefObject<HTMLTableElement>;
	outsideClickRef?: RefObject<HTMLTableSectionElement>;
	tasks: Task[];
	taskDispatch: React.Dispatch<TaskActionShape>;
	handleEditTask?: (
		a: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		b: Task
	) => void;
	editFormData: EditFormData;
	setEditTask?: React.Dispatch<React.SetStateAction<EditTask>>;
	handleEditFormKeyboard?: (e: React.KeyboardEvent) => void;
	isModal?: boolean;
	toggleModal: () => void;
	onHide: (e: React.MouseEvent | React.TouchEvent | KeyboardEvent) => void;
	setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
	handleMenuItemEvent: typeof handleMenuItemEvent;
	addFormData: EditFormData;
	setAddFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

const Main = ({
	handleFormSubmit,
	editTask,
	rowId,
	inputType,
	xPos,
	yPos,
	showMenu,
	outsideClickRef,
	tableRef,
	tasks,
	taskDispatch,
	handleEditTask,
	editFormData,
	setEditTask,
	handleEditFormKeyboard,
	isModal,
	toggleModal,
	onHide,
	setEditFormData,
	handleMenuItemEvent,
	addFormData,
	setAddFormData,
}: Props) => {
	const priorityInput = useRef<HTMLInputElement>(null);
	const letterPriority =
		inputType === 'priority-cell'
			? editFormData.letterPriority
			: addFormData.letterPriority;
	const numberPriority =
		inputType === 'priority-cell'
			? editFormData.numberPriority
			: addFormData.numberPriority;

	useEffect(() => {
		inputType === 'priority-input' && priorityInput.current?.focus();
	}, [inputType, priorityInput]);

	const [Modal, ,] = useModal();

	let modal = isModal ? (
		<Modal role='dialog' onHide={onHide}>
			{(inputType === 'priority-cell' || inputType === 'priority-input') && (
				<PriorityContext.Provider
					value={{
						inputType: inputType,
						editFormData: editFormData,
						setEditFormData: setEditFormData,
						addFormData: addFormData,
						setAddFormData: setAddFormData,
						letterPriority: letterPriority,
						numberPriority: numberPriority,
						handleFormSubmit,
						toggleModal: toggleModal,
					}}
				>
					<UpdateTaskPriority />
				</PriorityContext.Provider>
			)}
		</Modal>
	) : null;

	return (
		<>
			{modal}
			<Card className={`${classes.card} card`}>
				<TableForm
					handleFormSubmit={handleFormSubmit}
					editTask={editTask}
					xPos={xPos}
					yPos={yPos}
					rowId={rowId}
					showMenu={showMenu}
					outsideClickRef={outsideClickRef}
					tableRef={tableRef}
					tasks={tasks}
					taskDispatch={taskDispatch}
					handleEditTask={handleEditTask}
					editFormData={editFormData}
					setEditTask={setEditTask}
					handleEditFormKeyboard={handleEditFormKeyboard}
					isModal={isModal}
					setEditFormData={setEditFormData}
					handleMenuItemEvent={handleMenuItemEvent}
				/>
				<AddTaskForm
					addFormData={addFormData}
					ref={priorityInput}
					taskDispatch={taskDispatch}
					setAddFormData={setAddFormData}
					inputType={inputType}
					toggleModal={toggleModal}
				/>
			</Card>
		</>
	);
};

export default Main;
