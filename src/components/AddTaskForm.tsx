import React, { RefObject, ChangeEvent, useEffect } from 'react';

import ButtonGradient from './UI/Button/ButtonGradient';
import classes from '../App.module.scss';

interface Props {
	handleAddFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	handleAddFormChange: (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void;
	handleAddFormKeydown: (e: React.KeyboardEvent) => void;
	isError: boolean;
	addFormData: AddFormData;
	priorityInput: RefObject<HTMLInputElement>;
	editMode: string | null | undefined;
}

type AddFormData = {
	status: string | null;
	letterPriority: string;
	numberPriority: string;
	priority: string | null;
	description: string | null;
};

const AddTaskForm = ({
	handleAddFormSubmit,
	handleAddFormChange,
	handleAddFormKeydown,
	isError,
	addFormData,
	priorityInput,
	editMode,
}: Props) => {
	useEffect(() => {
		editMode === 'priority-input' && !isError && priorityInput.current?.focus();
	}, [isError, editMode, priorityInput]);
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
