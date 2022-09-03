import React, { useRef, useEffect, useContext } from 'react';

import { PriorityContext } from '../../../context/priority-context';
import Button from '../../UI/Button/Button';
import classes from './UpdateTaskPriority.module.scss';
import { EditFormData } from '../../../ts/interfaces';

const UpdateTaskPriority = () => {
	useEffect(() => {
		radioRef.current?.focus();
	}, []);

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
	} = useContext(PriorityContext);

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
		setState({ isError: false });
	};
	const radioRef = useRef<HTMLInputElement>(null);

	return (
		<form
			className={classes.UpdateTaskPriority}
			onSubmit={
				editMode === 'priority-cell'
					? handleEditFormSubmit
					: handleAddFormChange
			}
			onClick={(e) => e.stopPropagation()}
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
						onInput={letterPriorityHandler}
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
						onInput={letterPriorityHandler}
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
						onInput={letterPriorityHandler}
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
				onClick={(event: React.MouseEvent<Element>) =>
					updatePriorityHandler(event)
				}
				disabled={letterPriority ? false : true}
			>
				CONFIRM PRIORITY
			</Button>
		</form>
	);
};

export default UpdateTaskPriority;
