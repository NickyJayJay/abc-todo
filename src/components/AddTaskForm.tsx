import React, { ChangeEvent, forwardRef, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig';

import ButtonGradient from './UI/Button/ButtonGradient';
import classes from '../App.module.scss';
import { EditFormData, EditTask } from '../ts/interfaces';
import { TaskActionType } from '../ts/enums';
import { TaskActionShape } from '../ts/types';
import { ErrorsAndLoading } from '../ts/interfaces';

interface Props {
	handleAddFormChange: (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void;
	addFormData: EditFormData;
	taskDispatch: React.Dispatch<TaskActionShape>;
	setAddFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
	editTask: EditTask;
	setState: React.Dispatch<React.SetStateAction<ErrorsAndLoading>>;
	isError: boolean | undefined;
}

const AddTaskForm = forwardRef<HTMLInputElement, Props>((props, ref) => {
	useEffect(() => {
		props.editTask.inputType === 'status-input' && selectRef.current?.focus();
	}, [props.editTask.inputType]);

	// Initialize Firebase and set bindings
	const app = initializeApp(firebaseConfig);
	const url = app.options.databaseURL;

	const selectRef = useRef<HTMLSelectElement>(null);

	const handleAddFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const newTask = {
			id: nanoid(),
			key: nanoid(),
			status: props.addFormData.status,
			priority: props.addFormData.priority,
			description: props.addFormData.description,
		};

		props.taskDispatch({
			type: TaskActionType.ADD,
			payload: {
				id: newTask.id,
				key: newTask.key,
				status: props.addFormData.status,
				priority: props.addFormData.priority,
				description: props.addFormData.description,
			},
		});

		props.setAddFormData({
			status: 'Select Status',
			letterPriority: '',
			numberPriority: '',
			priority: '',
			description: '',
		});

		fetch(`${url}/tasks.json`, {
			method: 'POST',
			body: JSON.stringify({
				status: props.addFormData.status,
				priority: props.addFormData.priority,
				description: props.addFormData.description,
			}),
		});
	};

	const handleAddFormKeydown = (e: React.KeyboardEvent | ChangeEvent) => {
		(e as React.KeyboardEvent).key === 'Enter' && e.preventDefault();

		const focusableElements = document.querySelectorAll(
			'a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
		);
		const i = Array.from(focusableElements).indexOf(e.target as HTMLElement);
		const nextFocusableEl = focusableElements[i + 1];
		const prevFocusableEl = focusableElements[i - 1];

		if (!nextFocusableEl || !prevFocusableEl) return;

		if (
			props.editTask.inputType === 'priority-input' &&
			(e as React.KeyboardEvent).key !== 'Tab' &&
			!(e as React.KeyboardEvent).shiftKey
		) {
			e.preventDefault();
			props.setState({ isError: true });
		} else if (
			((props.editTask.inputType === 'priority-input' ||
				props.editTask.inputType === 'status-input') &&
				(e as React.KeyboardEvent).key) === 'Tab' &&
			!(e as React.KeyboardEvent).shiftKey
		) {
			e.preventDefault();
			(nextFocusableEl as HTMLElement).click();
			(nextFocusableEl as HTMLElement).focus();
		} else if (
			(e as React.KeyboardEvent).key === 'Tab' &&
			(e as React.KeyboardEvent).shiftKey
		) {
			e.preventDefault();
			(prevFocusableEl as HTMLElement).click();
		}
	};

	const handlePriorityEvent = (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault();
		(e as React.MouseEvent).clientX !== 0 &&
			(e as React.MouseEvent).clientY !== 0 &&
			props.setState({ isError: true });
	};

	return (
		<div className={classes.addTask}>
			<form onSubmit={handleAddFormSubmit}>
				<fieldset>
					<legend>Add a Task</legend>
					<select
						onChange={(e) => props.handleAddFormChange(e)}
						onKeyDown={(e) => handleAddFormKeydown(e)}
						name='status'
						value={props.addFormData.status as string}
						data-id='status-input'
						aria-label='Select status'
						ref={selectRef}
					>
						<option hidden>Select Status</option>
						<option disabled defaultValue=''>
							Select Status
						</option>
						<option value='In Process'>In Process</option>
						<option value='Completed'>Completed</option>
						<option value='Forwarded'>Forwarded</option>
						<option value='Delegated'>Delegated</option>
					</select>
					<input
						type='text'
						name='priority'
						data-id='priority-input'
						placeholder='ABC'
						value={props.addFormData.priority as string}
						onChange={(e) => handleAddFormKeydown(e)}
						onKeyDown={(e) => handleAddFormKeydown(e)}
						onTouchEnd={(e) => handlePriorityEvent(e)}
						onClick={(e) => handlePriorityEvent(e)}
						aria-label='Enter task priority'
						ref={ref}
						className={
							props.editTask.inputType === 'priority-input'
								? classes.active
								: ''
						}
					></input>
					<input
						type='text'
						name='description'
						data-id='description-input'
						placeholder='Enter task description...'
						value={props.addFormData.description as string}
						onChange={(e) => props.handleAddFormChange(e)}
						onKeyDown={(e) => handleAddFormKeydown(e)}
						aria-label='Enter task description'
						maxLength={150}
					/>
					<ButtonGradient type='submit'>
						<span>Add Task</span>
					</ButtonGradient>
				</fieldset>
			</form>
		</div>
	);
});

export default AddTaskForm;
