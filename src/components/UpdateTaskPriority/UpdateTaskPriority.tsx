import { useRef, useEffect, useContext } from 'react';
import { PriorityContext } from '../../context/priority-context';
import Button from '../UI/Button/Button';
import classes from './UpdateTaskPriority.module.scss';
import {
	letterPriorityHandler,
	numberPriorityHandler,
	updatePriorityHandler,
} from './handlers';

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
		isModal,
		toggleModal,
	} = useContext(PriorityContext);

	const options = {
		inputType,
		editFormData,
		addFormData,
		letterPriority,
		numberPriority,
		setEditFormData,
		setAddFormData,
		handleFormSubmit,
		toggleModal,
	};

	const radioRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		(inputType === 'priority-input' || inputType === 'priority-cell') &&
			isModal &&
			radioRef.current?.focus();
	}, [isModal, inputType]);

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
						onChange={letterPriorityHandler(options)}
						onTouchStart={letterPriorityHandler(options)}
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
						onChange={letterPriorityHandler(options)}
						onTouchStart={letterPriorityHandler(options)}
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
						onChange={letterPriorityHandler(options)}
						onTouchStart={letterPriorityHandler(options)}
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
					onChange={numberPriorityHandler(options)}
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
				onTouchStart={updatePriorityHandler(options)}
				onClick={updatePriorityHandler(options)}
				disabled={letterPriority ? false : true}
			>
				CONFIRM PRIORITY
			</Button>
		</form>
	);
};

export default UpdateTaskPriority;
