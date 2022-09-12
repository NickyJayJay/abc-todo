import React, {
	useState,
	useRef,
	useCallback,
	useEffect,
	ChangeEvent,
	useReducer,
} from 'react';
import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
import { getDatabase, ref, update } from 'firebase/database';

import { PriorityContext } from './context/priority-context';
import { firebaseConfig } from './firebaseConfig';
import useOutsideClick from './hooks/useOutsideClick';
import TableForm from './components/TableForm';
import AddTaskForm from './components/AddTaskForm';
import Card from './components/UI/Card/Card';
import Modal from './components/UI/Modal/Modal';
import classes from './App.module.scss';
import { Task } from './ts/types';
import { EditTask, EditFormData, ErrorsAndLoading } from './ts/interfaces';
import { TaskActionType } from './ts/enums';
import { taskReducer } from './reducers';

const App = () => {
	const [tasks, taskDispatch] = useReducer(taskReducer, []);

	const [state, setState] = useState<ErrorsAndLoading>({
		isLoading: true,
		httpError: null,
		isError: false,
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

	// Initialize Firebase and set bindings
	const app = initializeApp(firebaseConfig);
	const db = getDatabase(app);
	// const auth = getAuth();
	const url = app.options.databaseURL;

	const priorityInput = useRef<HTMLInputElement>(null);

	useEffect(() => {
		editTask.inputType === 'priority-input' &&
			!state.isError &&
			priorityInput.current?.focus();
	}, [state.isError, editTask.inputType, priorityInput]);

	useEffect(() => {
		if (editTask.showMenu || state.isError) {
			document.body.classList.add('lockScroll');
			document.body.style.top = `-${window.scrollY}px`;
		}
		if (!editTask.showMenu && !state.isError) {
			document.body.classList.remove('lockScroll');
			document.body.style.top = '';
		}
	}, [editTask.showMenu, state.isError]);

	useEffect(() => {
		const close = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				state.isError && hideModalHandler(e);
				editTask.showMenu && setEditTask({ ...editTask, showMenu: false });
			}
		};
		window.addEventListener('keydown', close);
		return () => window.removeEventListener('keydown', close);
	});

	useEffect(() => {
		const fetchTasks = async () => {
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

			loadedTasks.sort((a: Task, b: Task) => {
				const priorityA = a.priority as string;
				const priorityB = b.priority as string;
				const [letterA, numA] = priorityA.split(/([1-9]{1,2})/);
				const [letterB, numB] = priorityB.split(/([1-9]{1,2})/);
				const priorityNumberA = Number(numA);
				const priorityNumberB = Number(numB);

				if (priorityA === '') return 1;
				if (priorityB === '') return -1;

				if (letterA > letterB) return 1;
				if (letterA < letterB) return -1;

				if (priorityNumberA > priorityNumberB) return 1;
				if (priorityNumberA < priorityNumberB) return -1;

				if (priorityA.length === 1) {
					return -1;
				} else {
					return 0;
				}
			});

			taskDispatch({
				type: TaskActionType.SET,
				data: loadedTasks,
			});
			setState({ isLoading: false });
		};

		fetchTasks().catch((error) => {
			setState({ isLoading: false, httpError: error.message });
		});
	}, [url]);

	const setX = useCallback(
		(e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
			if (e.type === 'click') {
				return `${(e as React.MouseEvent).pageX}px`;
			} else if (e.type === 'touchstart') {
				return `${(e as React.TouchEvent).touches[0].pageX}px`;
			} else if (e.type === 'keydown') {
				return `${(e.target as HTMLElement).getBoundingClientRect().x + 35}px`;
			} else {
				return null;
			}
		},
		[]
	);

	const outsideClickRef = useOutsideClick((e) => handleOutsideClick(e));

	const setY = useCallback(
		(e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
			const containerBottom = (
				outsideClickRef.current as HTMLElement
			).getBoundingClientRect().bottom;
			const menuBottom: number =
				(e as React.MouseEvent).pageY + 224 - window.scrollY ||
				((e as React.TouchEvent).touches &&
					(e as React.TouchEvent).touches[0].pageY + 224 - window.scrollY) ||
				(e.target as HTMLElement).getBoundingClientRect().y + 224;
			if (e.type === 'click' && menuBottom <= containerBottom) {
				return `${(e as React.MouseEvent).pageY}px`;
			} else if (e.type === 'click' && menuBottom > containerBottom) {
				return `${
					(e as React.MouseEvent).pageY - (menuBottom - containerBottom)
				}px`;
			} else if (
				e.type === 'touchstart' &&
				(e as React.TouchEvent).touches &&
				(e as React.TouchEvent).touches[0].pageY &&
				menuBottom <= containerBottom
			) {
				return `${(e as React.TouchEvent).touches[0].pageY}px`;
			} else if (
				e.type === 'touchstart' &&
				(e as React.TouchEvent).touches &&
				(e as React.TouchEvent).touches[0].pageY &&
				menuBottom > containerBottom
			) {
				return `${
					(e as React.TouchEvent).touches[0].pageY -
					(menuBottom - containerBottom)
				}px`;
			} else if (
				e.type === 'keydown' &&
				(e.target as HTMLElement).getBoundingClientRect() &&
				menuBottom <= containerBottom
			) {
				return `${(e.target as HTMLElement).getBoundingClientRect().y + 35}px`;
			} else if (
				e.type === 'keydown' &&
				(e.target as HTMLElement).getBoundingClientRect() &&
				menuBottom > containerBottom
			) {
				return `${
					(e.target as HTMLElement).getBoundingClientRect().y -
					(menuBottom - containerBottom)
				}px`;
			} else {
				return null;
			}
		},
		[outsideClickRef]
	);

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

	const handleAddFormChange = (
		e: ChangeEvent<Element> | React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		const fieldName = (e.target as HTMLInputElement).getAttribute('name');
		if (!fieldName) return;
		const fieldValue =
			fieldName === 'priority'
				? (e.target as HTMLInputElement).value.toUpperCase()
				: (e.target as HTMLInputElement).value;

		const newFormData = { ...addFormData };
		newFormData[fieldName as keyof typeof newFormData] = fieldValue;

		handlePriorityValidation(fieldValue, fieldName, newFormData);

		setAddFormData(newFormData);
	};

	const handlePriorityValidation = (
		fieldValue: string,
		fieldName: string | null,
		newFormData: EditFormData
	) => {
		if (fieldName !== 'priority') return;

		if (
			/^([ABC]?|[ABC][1-9]?|[ABC][1-9][0-9])?$/i.test(fieldValue) &&
			fieldValue.length <= 3
		) {
			setState({ isError: false });
		} else if (editTask.inputType === 'priority-cell') {
			newFormData[fieldName] = editFormData.priority;
			setState({ isError: true });
		} else if (editTask.inputType === 'priority-input') {
			newFormData[fieldName] = addFormData.priority;
			setState({ isError: true });
		}
	};

	const handleEditFormChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const fieldName = e.target.getAttribute('name');
		const fieldValue =
			fieldName === 'priority' ? e.target.value.toUpperCase() : e.target.value;

		const newFormData = { ...editFormData };
		newFormData[fieldName as keyof typeof newFormData] = fieldValue;

		handlePriorityValidation(fieldValue, fieldName, newFormData);

		setEditFormData(newFormData);
	};

	const handleEditFormSubmit = (e: React.FormEvent) => {
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
		const curFocusableEl = form!.elements[i];
		const nextFocusableEl = form!.elements[i + 1] || focusableElements[j + 1];
		const prevFocusableEl = form!.elements[i - 1] || focusableElements[j - 1];

		if (!nextFocusableEl || !prevFocusableEl) return;

		if (
			e.key === 'Enter' ||
			(e.key === 'Tab' &&
				!e.shiftKey &&
				(curFocusableEl.getAttribute('name') === 'priority' ||
					curFocusableEl.getAttribute('name') === 'description'))
		) {
			e.preventDefault();
			(nextFocusableEl as HTMLElement).click();
		} else if (
			e.key === 'Tab' &&
			e.shiftKey &&
			(curFocusableEl.getAttribute('name') === 'priority' ||
				curFocusableEl.getAttribute('name') === 'description')
		) {
			e.preventDefault();
			(prevFocusableEl as HTMLElement).click();
		}

		const fieldName = e.target.getAttribute('name');
		const fieldValue =
			fieldName === 'priority'
				? (e.target as HTMLInputElement | HTMLSelectElement).value.toUpperCase()
				: (e.target as HTMLInputElement | HTMLSelectElement).value;

		const newFormData = { ...editFormData };
		newFormData[fieldName as keyof typeof newFormData] = fieldValue;

		handlePriorityValidation(fieldValue, fieldName, newFormData);
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
				(e as React.MouseEvent).type === 'click') &&
			priorityCell
		) {
			setState({ isError: true });
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

	const hideModalHandler = (
		e: React.MouseEvent | TouchEvent | KeyboardEvent
	) => {
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
		setState({ isError: false });
	};

	if (state.httpError) {
		return (
			<section className={classes.tasksError}>
				<p>{state.httpError}</p>
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
			{state.isError &&
				(editTask.inputType === 'priority-cell' ||
					editTask.inputType === 'priority-input') && (
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
							handleEditFormSubmit,
							handleAddFormChange,
						}}
					>
						<Modal onHide={hideModalHandler} />
					</PriorityContext.Provider>
				)}
			<Card className={`${classes.card} card`}>
				<TableForm
					handleEditFormSubmit={handleEditFormSubmit}
					editTask={editTask}
					outsideClickRef={outsideClickRef}
					tasks={tasks}
					taskDispatch={taskDispatch}
					handleEditTask={handleEditTask}
					editFormData={editFormData}
					setEditTask={setEditTask}
					handleEditFormChange={handleEditFormChange}
					handleEditFormKeyboard={handleEditFormKeyboard}
					isError={state.isError as boolean}
				/>

				<AddTaskForm
					handleAddFormChange={handleAddFormChange}
					addFormData={addFormData}
					ref={priorityInput}
					taskDispatch={taskDispatch}
					setAddFormData={setAddFormData}
				/>
			</Card>
		</div>
	);
};

export default App;
