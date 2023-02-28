import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { ref, update } from 'firebase/database';

import { db, url } from '../../firebaseConfig';
import useOutsideClick from '../../hooks/useOutsideClick';
import Main from '../Main/Main';
import classes from './App.module.scss';
import { Task } from '../../ts/types';
import { EditTask, EditFormData, ErrorsAndLoading } from '../../ts/interfaces';
import { TaskActionType } from '../../ts/enums';
import { taskReducer } from '../../reducers';
import { handleMenuItemEvent } from '../UI/ContextMenu/handleMenuItemEvent';
import sortList from '../../utilities/sortList';
import useCoordinates from '../../hooks/useCoordinates';
import useModal from '../../hooks/useModal';

const App = () => {
	const [tasks, taskDispatch] = useReducer(taskReducer, []);

	const [state, setState] = useState<ErrorsAndLoading>({
		isLoading: true,
		httpError: null,
	});

	const [addFormData, setAddFormData] = useState<EditFormData>({
		status: '',
		letterPriority: '',
		numberPriority: '',
		priority: '',
		description: '',
	});

	const [editFormData, setEditFormData] = useState<EditFormData>({
		status: '',
		letterPriority: '',
		numberPriority: '',
		priority: '',
		description: '',
	});

	const [editTask, setEditTask] = useState<EditTask>({
		rowId: null,
		inputType: null,
		xPos: '0px',
		yPos: '0px',
		xPosTouch: '0px',
		yPosTouch: '0px',
		showMenu: false,
	});

	const [setX, setY, tableRef] = useCoordinates();

	const handleOutsideClick = useCallback(
		(e: MouseEvent | TouchEvent | KeyboardEvent) => {
			setEditTask({
				rowId: null,
				inputType: (e.target as HTMLElement).dataset.id || null,
				xPos: null,
				yPos: null,
				xPosTouch: null,
				yPosTouch: null,
				showMenu:
					((editTask.xPos && editTask.yPos) ||
						(editTask.xPosTouch && editTask.yPosTouch)) &&
					(e.target as HTMLButtonElement).dataset.id === 'status-cell'
						? true
						: false,
			});
		},
		[editTask.xPos, editTask.xPosTouch, editTask.yPos, editTask.yPosTouch]
	);

	const outsideClickRef = useOutsideClick((e) => handleOutsideClick(e));

	const [, toggleModal, isModal] = useModal();

	useEffect(() => {
		if (editTask.showMenu || isModal) {
			document.body.classList.add('lockScroll');
			document.body.style.top = `-${window.scrollY}px`;
		}
		if (!editTask.showMenu && !isModal) {
			document.body.classList.remove('lockScroll');
			document.body.style.top = '';
		}

		const close = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				isModal && hideModalHandler(e);
				editTask.showMenu && setEditTask({ ...editTask, showMenu: false });
			}
		};
		window.addEventListener('keydown', close);
		return () => window.removeEventListener('keydown', close);
	});

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await fetch(`${url}/tasks.json`);

				if (!response.ok) {
					throw new Error('Something went wrong!');
				}

				const responseData = await response.json();
				const loadedTasks: Task[] = [];

				for (const key in responseData) {
					loadedTasks.push({
						id: key,
						status: responseData[key].status,
						priority: responseData[key].priority,
						description: responseData[key].description,
					});
				}

				sortList(loadedTasks);

				taskDispatch({
					type: TaskActionType.SET,
					data: loadedTasks,
				});
				setState({ isLoading: false, httpError: null });
			} catch (error) {
				if (error instanceof Error) {
					setState({
						isLoading: false,
						httpError: error.message,
					});
				} else {
					console.log('Unexpected error: ', error);
				}
			}
		};
		fetchTasks();
	}, []);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const editedTask = {
			id: editTask.rowId,
			status: editFormData.status,
			priority: editFormData.priority,
			description: editFormData.description,
		};

		const newTasks = [...tasks];
		const index = tasks.findIndex((task) => task.id === editTask.rowId);
		newTasks[index] = editedTask;

		taskDispatch({
			type: TaskActionType.SET,
			data: newTasks,
		});

		sortList(newTasks);

		const dbRef = ref(db, `tasks/${editTask.rowId}`);
		update(dbRef, editedTask);
	};

	const handleEditFormKeyboard = (e: React.KeyboardEvent) => {
		const form = (e.target as HTMLInputElement).form;
		const focusableElements = document.querySelectorAll(
			'a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
		);
		const i = Array.from(form!.elements).indexOf(e.target as HTMLButtonElement);
		const j = Array.from(focusableElements).indexOf(e.target as HTMLElement);
		const curFocusableEl = form!.elements[i] || focusableElements[j];
		const nextFocusableEl = form!.elements[i + 1] || focusableElements[j + 1];
		const prevFocusableEl = form!.elements[i - 1] || focusableElements[j - 1];

		if (!nextFocusableEl || !prevFocusableEl) return;

		if (
			curFocusableEl.getAttribute('name') === 'description' &&
			(e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey))
		) {
			e.preventDefault();
			handleFormSubmit(e);
			(nextFocusableEl as HTMLElement).click();
		} else if (
			e.key === 'Tab' &&
			e.shiftKey &&
			((curFocusableEl as HTMLElement).dataset.id === 'priority-cell' ||
				curFocusableEl.getAttribute('name') === 'description')
		) {
			e.preventDefault();
			(prevFocusableEl as HTMLElement).click();
		}

		const fieldName = (e.target as Element).getAttribute('name');
		const fieldValue =
			fieldName === 'priority'
				? (e.target as HTMLInputElement | HTMLSelectElement).value.toUpperCase()
				: (e.target as HTMLInputElement | HTMLSelectElement).value;

		const newFormData = { ...editFormData };
		newFormData[fieldName as keyof typeof newFormData] = fieldValue;

		setEditFormData(newFormData);
	};

	const handleEditTask = (
		e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
		task: Task
	) => {
		let statusCell = (e.target as HTMLElement).dataset.id === 'status-cell',
			priorityCell = (e.target as HTMLElement).dataset.id === 'priority-cell';

		if (
			((e as React.KeyboardEvent).key === 'Tab' ||
				(e as React.KeyboardEvent).key === 'Escape' ||
				(e as React.KeyboardEvent).shiftKey) &&
			statusCell
		)
			return;

		if (
			((e as React.KeyboardEvent).key === 'Enter' ||
				((e as React.MouseEvent).type === 'click' &&
					(e as React.MouseEvent).clientX !== 0 &&
					(e as React.MouseEvent).clientY !== 0)) &&
			priorityCell
		) {
			toggleModal();
		}

		e.stopPropagation();
		statusCell && e.preventDefault();
		statusCell && (e.target as HTMLElement).tagName === 'IMG'
			? (e.target as HTMLElement).parentElement?.focus()
			: (e.target as HTMLElement).focus();
		setEditTask({
			rowId: task.id || null,
			inputType: (e.target as HTMLElement).dataset.id,
			xPos: setX(e),
			yPos: setY(e),
			xPosTouch: setX(e),
			yPosTouch: setY(e),
			showMenu:
				((e as React.MouseEvent).pageX &&
					(e as React.MouseEvent).pageY &&
					statusCell) ||
				((e as React.KeyboardEvent).key === 'Enter' && statusCell)
					? true
					: false,
		});
		const formValues: EditFormData = {
			status: task.status || null,
			letterPriority: '',
			numberPriority: '',
			priority: task.priority,
			description: task.description,
		};

		setEditFormData(formValues);
	};

	const hideModalHandler = useCallback(
		(e: React.MouseEvent | React.TouchEvent | KeyboardEvent) => {
			e.stopPropagation();
			if ((e as KeyboardEvent).key === 'Tab') return;

			if (editTask.inputType === 'priority-cell') {
				const newFormData = {
					...editFormData,
					letterPriority: '',
					numberPriority: '',
				};
				setEditFormData(newFormData);
			} else {
				const newFormData = {
					...addFormData,
					letterPriority: '',
					numberPriority: '',
				};
				setAddFormData(newFormData);
			}
			setTimeout(() => {
				toggleModal();
			}, 250);
		},
		[toggleModal, editFormData, addFormData, editTask.inputType]
	);

	if (state.httpError) {
		return (
			<section className={classes.tasksError}>
				<p>Something went wrong...</p>
			</section>
		);
	}

	if (state.isLoading) {
		return (
			<section className={classes.tasksLoading}>
				<p>Loading...</p>
			</section>
		);
	}

	return (
		<div className={classes.appContainer}>
			<Main
				handleFormSubmit={handleFormSubmit}
				editTask={editTask}
				rowId={editTask.rowId}
				inputType={editTask.inputType}
				xPos={editTask.xPos}
				yPos={editTask.yPos}
				showMenu={editTask.showMenu}
				outsideClickRef={outsideClickRef}
				tableRef={tableRef}
				tasks={tasks}
				taskDispatch={taskDispatch}
				handleEditTask={handleEditTask}
				editFormData={editFormData}
				setEditTask={setEditTask}
				handleEditFormKeyboard={handleEditFormKeyboard}
				isModal={isModal}
				toggleModal={toggleModal}
				onHide={hideModalHandler}
				setEditFormData={setEditFormData}
				handleMenuItemEvent={handleMenuItemEvent}
				addFormData={addFormData}
				setAddFormData={setAddFormData}
				setState={setState}
			/>
		</div>
	);
};

export default App;
