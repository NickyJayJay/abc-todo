import React, { useRef, useEffect, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { ref, update, getDatabase } from 'firebase/database';

import { firebaseConfig } from '../../../firebaseConfig';
import { PriorityContext } from '../../../context/priority-context';
import Button from '../../UI/Button/Button';
import classes from './UpdateTaskPriority.module.scss';
import { EditFormData } from '../../../ts/interfaces';
import { TaskActionType } from '../../../ts/enums';

// Initialize Firebase and set bindings
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const UpdateTaskPriority = () => {
	const {
		editTask,
		editFormData,
		setEditFormData,
		addFormData,
		setAddFormData,
		setState,
		letterPriority,
		numberPriority,
		editMode,
		handleEditFormSubmit,
		handleAddFormChange,
		tasks,
		taskDispatch,
		isError,
	} = useContext(PriorityContext);

	useEffect(() => {
		(editTask.inputType === 'priority-input' ||
			editTask.inputType === 'priority-cell') &&
			isError &&
			radioRef.current?.focus();
	}, [isError]);

	const letterPriorityHandler = (e: React.FormEvent<HTMLInputElement>) => {
		if (editTask.inputType === 'priority-cell') {
			const newFormData: EditFormData = {
				...editFormData,
				letterPriority: (e.target as HTMLInputElement).value,
				priority: (e.target as HTMLInputElement).value + numberPriority,
			};
			setEditFormData(newFormData);
		} else {
			const newFormData = { ...addFormData };
			newFormData.letterPriority = (e.target as HTMLInputElement).value;
			setAddFormData(newFormData);
		}
	};

	const numberPriorityHandler = (e: React.FormEvent<HTMLInputElement>) => {
		if (editTask.inputType === 'priority-cell') {
			const newFormData: EditFormData = {
				...editFormData,
				numberPriority: Math.abs(
					parseInt((e.target as HTMLInputElement).value.slice(0, 2))
				).toString(),
				priority: letterPriority + (e.target as HTMLInputElement).value,
			};
			setEditFormData(newFormData);
		} else {
			const newFormData = { ...addFormData };
			newFormData.numberPriority = Math.abs(
				parseInt((e.target as HTMLInputElement).value.slice(0, 2))
			).toString();
			setAddFormData(newFormData);
		}
	};

	const updatePriorityHandler = (
		e: React.MouseEvent<Element> | React.TouchEvent<Element>
	) => {
		e.preventDefault();

		if (editTask.inputType === 'priority-cell') {
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
		} else {
			const newFormData: EditFormData = {
				...addFormData,
				priority: `${addFormData.letterPriority}${addFormData.numberPriority}`,
				letterPriority: '',
				numberPriority: '',
			};
			setAddFormData(newFormData);
		}
		setTimeout(() => {
			setState({ isError: false });
		}, 250);
	};

	const radioRef = useRef<HTMLInputElement>(null);

	return (
		<form
			className={classes.UpdateTaskPriority}
			onClick={(e) => e.stopPropagation()}
			onTouchStart={(e) => e.stopPropagation()}
		>
			<h2>Update Task Priority</h2>
			<fieldset>
				<legend>First, choose a priority letter (A, B, C)</legend>
				<div className={classes.inputWrap}>
					<input
						type='radio'
						id='A'
						name='letter'
						value='A'
						onChange={letterPriorityHandler}
						ref={radioRef}
					/>
					<label>
						A <span>(Important and time sensitive)</span>
					</label>
				</div>
				<div className={classes.inputWrap}>
					<input
						type='radio'
						id='B'
						name='letter'
						value='B'
						onChange={letterPriorityHandler}
					/>
					<label>
						B <span>(Important but not time sensitive)</span>
					</label>
				</div>
				<div className={classes.inputWrap}>
					<input
						type='radio'
						id='C'
						name='letter'
						value='C'
						onChange={letterPriorityHandler}
					/>
					<label>
						C <span>(Not important)</span>
					</label>
				</div>
			</fieldset>
			<fieldset>
				<legend>Then enter a priority number (1 - 99)</legend>
				<input
					type='number'
					min='1'
					max='99'
					onInput={numberPriorityHandler}
					name='priority'
				/>
			</fieldset>
			<div className={classes.preview}>
				{letterPriority}
				{numberPriority}
			</div>
			<Button
				type='submit'
				onTouchStart={(event) => updatePriorityHandler(event)}
				onClick={(event) => updatePriorityHandler(event)}
				disabled={letterPriority ? false : true}
			>
				CONFIRM PRIORITY
			</Button>
		</form>
	);
};

export default UpdateTaskPriority;
