import React, { ChangeEvent, forwardRef } from 'react';
import { nanoid } from 'nanoid';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig';

import ButtonGradient from './UI/Button/ButtonGradient';
import classes from '../App.module.scss';
import { EditFormData } from '../ts/interfaces';
import { TaskActionType } from '../ts/enums';
import { TaskActionShape } from '../ts/types';

interface Props {
	handlePriorityValidation: (e: any) => void;
	handleAddFormChange: (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void;
	addFormData: EditFormData;
	taskDispatch: React.Dispatch<TaskActionShape>;
	setAddFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

const AddTaskForm = forwardRef<HTMLInputElement, Props>((props, ref) => {
	// Initialize Firebase and set bindings
	const app = initializeApp(firebaseConfig);
	const url = app.options.databaseURL;

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

	const handleAddFormKeydown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			const form = (e.target as HTMLInputElement | HTMLSelectElement).form;
			const i = Array.from(form!.elements).indexOf(e.target);
			const nextFormControl = form!.elements[i + 1];
			(nextFormControl as HTMLElement).focus();
			e.preventDefault();
		}
	};

	return (
		<div className={classes.addTask}>
			<form onSubmit={handleAddFormSubmit}>
				<fieldset>
					<legend>Add a Task</legend>
					<select
						onChange={props.handleAddFormChange}
						onKeyDown={(e) => handleAddFormKeydown(e)}
						name='status'
						value={props.addFormData.status as string}
						data-id='status-input'
						aria-label='Select status'
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
						onClick={(e) => props.handlePriorityValidation(e)}
						onChange={(e) => props.handleAddFormChange(e)}
						onKeyDown={(e) => handleAddFormKeydown(e)}
						aria-label='Enter task priority'
						ref={ref}
					></input>
					<input
						type='text'
						name='description'
						data-id='description-input'
						placeholder='Enter task description...'
						value={props.addFormData.description as string}
						onChange={props.handleAddFormChange}
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
