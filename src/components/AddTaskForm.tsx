import React, { ChangeEvent, forwardRef } from 'react';

import ButtonGradient from './UI/Button/ButtonGradient';
import classes from '../App.module.scss';
import { EditFormData } from '../ts/interfaces';

interface Props {
	handleAddFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	handleAddFormChange: (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void;
	handleAddFormKeydown: (e: React.KeyboardEvent) => void;
	addFormData: EditFormData;
}

const AddTaskForm = forwardRef<HTMLInputElement, Props>((props, ref) => {
	return (
		<div className={classes.addTask}>
			<form onSubmit={props.handleAddFormSubmit}>
				<fieldset>
					<legend>Add a Task</legend>
					<select
						onChange={props.handleAddFormChange}
						onKeyDown={(e) => props.handleAddFormKeydown(e)}
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
						onChange={(e) => props.handleAddFormChange(e)}
						onKeyDown={(e) => props.handleAddFormKeydown(e)}
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
						onKeyDown={(e) => props.handleAddFormKeydown(e)}
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
