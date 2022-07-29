import React, { RefObject, ChangeEvent, useState } from 'react';
import { nanoid } from 'nanoid';

import ButtonGradient from './UI/Button/ButtonGradient';
import classes from '../App.module.scss';

interface Props {
	// handleAddFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	// handleAddFormChange: (
	// 	e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	// ) => void;
	// handleAddFormKeydown: (e: React.KeyboardEvent) => void;
	// handlePriorityValidation: (
	// 	a: string,
	// 	b: string | null,
	// 	c: AddFormData
	// ) => void;
	setTasks: React.Dispatch<React.SetStateAction<LoadedTask[]>>;
	setIsError: React.Dispatch<React.SetStateAction<boolean>>;
	priorityInput: RefObject<HTMLInputElement>;
	url: string;
	tasks: LoadedTask[];
}

type AddFormData = {
	status: string | null;
	letterPriority: string;
	numberPriority: string;
	priority: string | null;
	description: string | null;
};

type LoadedTask = {
	id: string | null;
	status: string | null | undefined;
	priority: string | null;
	description: string | null;
};

const AddTaskForm = ({
	setTasks,
	setIsError,
	priorityInput,
	url,
	tasks,
}: Props) => {
	const [addFormData, setAddFormData] = useState<AddFormData>({
		status: '',
		letterPriority: '',
		numberPriority: '',
		priority: '',
		description: '',
	});

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

	const handlePriorityValidation = (
		fieldValue: string,
		fieldName: string | null,
		newFormData: AddFormData
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

	return (
		<div className={classes.addTask}>
			<form onSubmit={handleAddFormSubmit}>
				<fieldset>
					<legend>Add a Task</legend>
					<select
						onChange={handleAddFormChange}
						onKeyDown={(e) => handleAddFormKeydown(e)}
						name='status'
						value={addFormData.status as string}
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
						value={addFormData.priority as string}
						onChange={(e) => handleAddFormChange(e)}
						onKeyDown={(e) => handleAddFormKeydown(e)}
						aria-label='Enter task priority'
						ref={priorityInput}
					></input>
					<input
						type='text'
						name='description'
						data-id='description-input'
						placeholder='Enter task description...'
						value={addFormData.description as string}
						onChange={handleAddFormChange}
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
};

export default AddTaskForm;
