import React, { forwardRef, useRef, useEffect } from 'react';

import ButtonGradient from '../UI/Button/ButtonGradient';
import classes from '../App/App.module.scss';
import { Options } from './handlers';
import {
	handleAddFormSubmit,
	handleAddFormKeydown,
	handlePriorityEvent,
	handleAddFormChange,
} from './handlers';

const AddTaskForm = forwardRef<HTMLInputElement, Options>(
	(
		{
			addFormData,
			taskDispatch,
			setAddFormData,
			inputType,
			setState,
			state,
			isModal,
		},
		ref
	) => {
		useEffect(() => {
			inputType === 'status-input' && selectRef.current?.focus();
			inputType === 'description-input' && descriptionRef.current?.focus();
		}, [inputType]);

		const selectRef = useRef<HTMLSelectElement>(null);
		const descriptionRef = useRef<HTMLInputElement>(null);
		const options: Options = {
			addFormData,
			taskDispatch,
			setAddFormData,
			inputType,
			setState,
			state,
			isModal,
		};

		return (
			<div className={classes.addTask}>
				<form onSubmit={handleAddFormSubmit(options)}>
					<fieldset>
						<legend>Add a Task</legend>
						<select
							onChange={handleAddFormChange(options)}
							onKeyDown={handleAddFormKeydown(options)}
							name='status'
							value={addFormData.status as string}
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
							value={addFormData.priority as string}
							onChange={handleAddFormKeydown(options)}
							onKeyDown={handleAddFormKeydown(options)}
							onTouchEnd={handlePriorityEvent(options)}
							onClick={handlePriorityEvent(options)}
							aria-label='Enter task priority'
							ref={ref}
							className={inputType === 'priority-input' ? classes.active : ''}
						></input>
						<input
							type='text'
							name='description'
							data-id='description-input'
							placeholder='Enter task description...'
							value={addFormData.description as string}
							onChange={handleAddFormChange(options)}
							onKeyDown={handleAddFormKeydown(options)}
							aria-label='Enter task description'
							maxLength={150}
							className={
								inputType === 'description-input' ? classes.active : ''
							}
							ref={descriptionRef}
						/>
						<ButtonGradient type='submit'>
							<span>Add Task</span>
						</ButtonGradient>
					</fieldset>
				</form>
			</div>
		);
	}
);

export default AddTaskForm;
