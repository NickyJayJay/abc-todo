import { useContext } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../../firebaseConfig';

import { PriorityContext } from '../../context/priority-context';
import Button from '../UI/Button/Button';
import classes from './UpdateTaskPriority.module.scss';
import {
	letterPriorityHandler,
	numberPriorityHandler,
	updatePriorityHandler,
} from './handlers';
import sortList from '../../utilities/sortList';

const UpdateTaskPriority = () => {
	const {
		inputType,
		editFormData,
		setEditFormData,
		addFormData,
		setAddFormData,
		letterPriority,
		numberPriority,
		handleFormSubmit,
		toggleModal,
		editTask,
		tasks,
		taskDispatch,
	} = useContext(PriorityContext);

	const numberPriorityOptions = {
		inputType,
		editFormData,
		addFormData,
		letterPriority,
		setEditFormData,
		setAddFormData,
	};

	const letterPriorityOptions = {
		inputType,
		editFormData,
		addFormData,
		numberPriority,
		setEditFormData,
		setAddFormData,
	};

	const updatePriorityOptions = {
		inputType,
		addFormData,
		setAddFormData,
		handleFormSubmit,
		toggleModal,
		editTask,
		editFormData,
		tasks,
		taskDispatch,
		sortList,
		ref,
		db,
		update,
	};

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
						onChange={letterPriorityHandler(letterPriorityOptions)}
						onTouchStart={letterPriorityHandler(letterPriorityOptions)}
						checked={letterPriority === 'A'}
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
						onChange={letterPriorityHandler(letterPriorityOptions)}
						onTouchStart={letterPriorityHandler(letterPriorityOptions)}
						checked={letterPriority === 'B'}
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
						onChange={letterPriorityHandler(letterPriorityOptions)}
						onTouchStart={letterPriorityHandler(letterPriorityOptions)}
						checked={letterPriority === 'C'}
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
					onChange={numberPriorityHandler(numberPriorityOptions)}
					name='priority'
					value={
						inputType === 'priority-cell'
							? editFormData?.numberPriority
							: addFormData?.numberPriority
					}
				/>
			</fieldset>
			<div className={classes.preview}>
				{letterPriority}
				{numberPriority !== '0' && numberPriority}
			</div>
			<Button
				type='submit'
				// onTouchStart={updatePriorityHandler(updatePriorityOptions)}
				onClick={updatePriorityHandler(updatePriorityOptions)}
				disabled={letterPriority ? false : true}
			>
				CONFIRM PRIORITY
			</Button>
		</form>
	);
};

export default UpdateTaskPriority;
