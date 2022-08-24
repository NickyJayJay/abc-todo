import React, { useRef, useEffect, useContext } from 'react';

import { PriorityContext } from '../../../context/priority-context';
import Button from '../../UI/Button/Button';
import classes from './UpdateTaskPriority.module.scss';

const UpdateTaskPriority = () => {
	const radioRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		radioRef.current?.focus();
	}, []);

	const {
		letterPriority,
		numberPriority,
		editMode,
		updatePriorityHandler,
		letterPriorityHandler,
		numberPriorityHandler,
		handleEditFormSubmit,
		handleAddFormChange,
	} = useContext(PriorityContext);

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
