import React, {
	useState,
	useRef,
	useCallback,
	useEffect,
	ChangeEvent,
} from 'react';
import { nanoid } from 'nanoid';
import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
import { getDatabase, ref, remove, update } from 'firebase/database';

import { PriorityContext } from './context/priority-context';
import { firebaseConfig } from './firebaseConfig';
import useOutsideClick from './hooks/useOutsideClick';
import TableForm from './components/TableForm';
import AddTaskForm from './components/AddTaskForm';
import Card from './components/UI/Card/Card';
import Modal from './components/UI/Modal/Modal';
import classes from './App.module.scss';

const App = () => {
	const [tasks, setTasks] = useState<LoadedTask[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [httpError, setHttpError] = useState(false);

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

	const [isError, setIsError] = useState<boolean>(false);

	const priorityInput = useRef<HTMLInputElement>(null);

	// Initialize Firebase and set bindings
	const app = initializeApp(firebaseConfig);
	const db = getDatabase(app);
	// const auth = getAuth();
	const url = app.options.databaseURL;

	useEffect(() => {
		if (editTask.showMenu || isError) {
			document.body.classList.add('lockScroll');
			document.body.style.top = `-${window.scrollY}px`;
		}
		if (!editTask.showMenu && !isError) {
			document.body.classList.remove('lockScroll');
			document.body.style.top = '';
		}
	}, [editTask.showMenu, isError]);

	useEffect(() => {
		const close = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				isError && hideModalHandler(e);
				editTask.showMenu && setEditTask({ ...editTask, showMenu: false });
			}
		};
		window.addEventListener('keydown', close);
		return () => window.removeEventListener('keydown', close);
	});

	type LoadedTask = {
		id: string | null;
		status: string | null | undefined;
		priority: string | null;
		description: string | null;
	};

	useEffect(() => {
		const fetchTasks = async () => {
			const response = await fetch(`${url}/tasks.json`);

			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const responseData = await response.json();
			const loadedTasks: LoadedTask[] = [];

			for (const key in responseData) {
				loadedTasks.push({
					id: key,
					status: responseData[key].status,
					priority: responseData[key].priority,
					description: responseData[key].description,
				});
			}
			setTasks(loadedTasks);
			setIsLoading(false);
		};

		fetchTasks().catch((error) => {
			setIsLoading(false);
			setHttpError(error.message);
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

	interface EditTask {
		rowId: string | null;
		inputType: string | null | undefined;
		xPos?: string | null;
		yPos: string | null;
		xPosTouch: string | null;
		yPosTouch: string | null;
		showMenu: boolean;
	}

	const handleOutsideClick = useCallback(
		(e: any) => {
			setEditTask({
				rowId: null,
				inputType: (e.target as HTMLElement).dataset.id || null,
				xPos: setX(e),
				yPos: setY(e),
				xPosTouch: setX(e),
				yPosTouch: setY(e),
				showMenu:
					((editTask.xPos && editTask.yPos) ||
						(editTask.xPosTouch && editTask.yPosTouch)) &&
					(e.target as HTMLButtonElement).dataset.id === 'status-cell'
						? true
						: false,
			});
		},
		[
			editTask.xPos,
			editTask.xPosTouch,
			editTask.yPos,
			editTask.yPosTouch,
			setX,
			setY,
		]
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

		const editedTask: LoadedTask = {
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
		setTasks(newTasks);
		const dbRef = ref(db, `tasks/${editTask.rowId}`);
		update(dbRef, editedTask);

		setEditTask({ ...editTask, showMenu: false });
	};

	interface EditFormData {
		status: string | null;
		letterPriority: string;
		numberPriority: string;
		priority: string | null;
		description: string | null;
	}

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
			setIsError(false);
		} else if (editTask.inputType === 'priority-cell') {
			newFormData[fieldName] = editFormData.priority;
			setIsError(true);
		} else if (editTask.inputType === 'priority-input') {
			newFormData[fieldName] = addFormData.priority;
			setIsError(true);
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

	const handleAddFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const newTask = {
			id: nanoid(),
			key: nanoid(),
			status: addFormData.status,
			priority: addFormData.priority,
			description: addFormData.description,
		};

		const newTasks = [...tasks, newTask];
		setTasks(newTasks);

		setAddFormData({
			status: 'Select Status',
			letterPriority: '',
			numberPriority: '',
			priority: '',
			description: '',
		});

		fetch(`${url}/tasks.json`, {
			method: 'POST',
			body: JSON.stringify({
				status: addFormData.status,
				priority: addFormData.priority,
				description: addFormData.description,
			}),
		});
	};

	const handleAddFormKeydown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			const form = (e.target as HTMLInputElement | HTMLSelectElement).form;
			const i = Array.from(form!.elements).indexOf(e.target);
			const nextFormControl = form!.elements[i + 1];
			(nextFormControl as HTMLElement).focus();
			e.preventDefault();
		}
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
		setTasks(newTasks);
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
		task: LoadedTask
	) => {
		let statusCell = (e.target as HTMLElement).dataset.id === 'status-cell';

		if (
			((e as React.KeyboardEvent).key === 'Tab' ||
				(e as React.KeyboardEvent).key === 'Escape' ||
				(e as React.KeyboardEvent).shiftKey) &&
			statusCell
		)
			return;

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

	const handleDeleteChange = (taskId: EditTask['rowId']) => {
		const newTasks = [...tasks];
		const index = tasks.findIndex((task) => task.id === taskId);

		newTasks.splice(index, 1);
		setTasks(newTasks);
		const dbRef = ref(db, `tasks/${taskId}`);
		remove(dbRef);
	};

	const letterPriorityHandler = (e: React.FormEvent<HTMLInputElement>) => {
		if (editTask.inputType === 'priority-cell') {
			const newFormData: EditFormData = { ...editFormData };
			newFormData.letterPriority = (e.target as HTMLInputElement).value;
			setEditFormData(newFormData);
		} else {
			const newFormData = { ...addFormData };
			newFormData.letterPriority = (e.target as HTMLInputElement).value;
			setAddFormData(newFormData);
		}
	};

	const numberPriorityHandler = (e: React.FormEvent<HTMLInputElement>) => {
		if (editTask.inputType === 'priority-cell') {
			const newFormData = { ...editFormData };
			newFormData.numberPriority = Math.abs(
				parseInt((e.target as HTMLInputElement).value.slice(0, 2))
			).toString();
			setEditFormData(newFormData);
		} else {
			const newFormData = { ...addFormData };
			newFormData.numberPriority = Math.abs(
				parseInt((e.target as HTMLInputElement).value.slice(0, 2))
			).toString();
			setAddFormData(newFormData);
		}
	};

	const updatePriorityHandler = (e: React.MouseEvent<Element>) => {
		e.preventDefault();

		if (editTask.inputType === 'priority-cell') {
			const newFormData: EditFormData = {
				...editFormData,
				priority: `${editFormData.letterPriority}${editFormData.numberPriority}`,
				letterPriority: '',
				numberPriority: '',
			};
			setEditFormData(newFormData);
		} else {
			const newFormData: EditFormData = {
				...addFormData,
				priority: `${addFormData.letterPriority}${addFormData.numberPriority}`,
				letterPriority: '',
				numberPriority: '',
			};
			setAddFormData(newFormData);
		}
		setIsError(false);
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
		setIsError(false);
	};

	if (httpError) {
		return (
			<section className={classes.tasksError}>
				<p>{httpError}</p>
			</section>
		);
	}

	if (isLoading) {
		return (
			<section className={classes.tasksLoading}>
				<p>Loading...</p>
			</section>
		);
	}

	return (
		<div className={classes.appContainer}>
			{isError &&
				(editTask.inputType === 'priority-cell' ||
					editTask.inputType === 'priority-input') && (
					<PriorityContext.Provider
						value={{
							letterPriority:
								editTask.inputType === 'priority-cell'
									? editFormData.letterPriority
									: addFormData.letterPriority,
							numberPriority:
								editTask.inputType === 'priority-cell'
									? editFormData.numberPriority
									: addFormData.numberPriority,
							editMode: editTask.inputType,
							priorityInput: priorityInput,
							updatePriorityHandler,
							letterPriorityHandler,
							numberPriorityHandler,
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
					handleMenuItemEvent={handleMenuItemEvent}
					outsideClickRef={outsideClickRef}
					tasks={tasks}
					handleEditTask={handleEditTask}
					editFormData={editFormData}
					handleEditFormChange={handleEditFormChange}
					handleEditFormKeyboard={handleEditFormKeyboard}
					isError={isError}
				/>

				<AddTaskForm
					handleAddFormSubmit={handleAddFormSubmit}
					handleAddFormChange={handleAddFormChange}
					handleAddFormKeydown={handleAddFormKeydown}
					isError={isError}
					addFormData={addFormData}
					priorityInput={priorityInput}
					editMode={editTask.inputType}
				/>
			</Card>
		</div>
	);
};

export default App;
