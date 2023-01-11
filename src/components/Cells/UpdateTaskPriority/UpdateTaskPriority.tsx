import React, { useRef, useEffect, useContext } from 'react';
import { PriorityContext } from '../../../context/priority-context';
import Button from '../../UI/Button/Button';
import classes from './UpdateTaskPriority.module.scss';
import { EditFormData } from '../../../ts/interfaces';

const UpdateTaskPriority = () => {
	const {
		inputType,
		editFormData,
		setEditFormData,
		addFormData,
		setAddFormData,
		setState,
		letterPriority,
		numberPriority,
		handleFormSubmit,
		isModal,
	} = useContext(PriorityContext);

	useEffect(() => {
		(inputType === 'priority-input' || inputType === 'priority-cell') &&
			isModal &&
			radioRef.current?.focus();
	}, [isModal, inputType]);

	const letterPriorityHandler = (e: React.FormEvent<HTMLInputElement>) => {
		if (inputType === 'priority-cell') {
			const newFormData: EditFormData = {
				...editFormData,
				letterPriority: (e.target as HTMLInputElement).value,
				priority: (e.target as HTMLInputElement).value + numberPriority,
			};
			setEditFormData && setEditFormData(newFormData);
		} else {
			const newFormData = { ...addFormData };
			newFormData.letterPriority = (e.target as HTMLInputElement).value;
			setAddFormData && setAddFormData(newFormData);
		}
	};

	const numberPriorityHandler = (e: React.FormEvent<HTMLInputElement>) => {
		if (inputType === 'priority-cell') {
			const newFormData: EditFormData = {
				...editFormData,
				numberPriority: Math.abs(
					Number((e.target as HTMLInputElement).value.slice(0, 2))
				).toString(),
				priority:
					(letterPriority as string) +
					parseInt((e.target as HTMLInputElement).value.slice(0, 2), 10),
			};
			setEditFormData && setEditFormData(newFormData);
		} else {
			const newFormData = { ...addFormData };
			newFormData.numberPriority = Math.abs(
				Number((e.target as HTMLInputElement).value.slice(0, 2))
			).toString();
			setAddFormData && setAddFormData(newFormData);
		}
	};

	const isFormValid = (
		e: React.MouseEvent<Element> | React.TouchEvent<Element>
	) => {
		const formControls: HTMLInputElement[] = Array.from(
			(e.target as HTMLFormElement).form
		);
		for (let control of formControls) {
			if (
				control.getAttribute('name') === 'priority' &&
				control.value.length <= 2 &&
				/^([1-9]?|[1-9][0-9])?$/i.test(control.value)
			) {
				return true;
			} else {
				continue;
			}
		}
		return false;
	};

	const updatePriorityHandler = (
		e: React.MouseEvent<Element> | React.TouchEvent<Element>
	) => {
		e.preventDefault();

		if (inputType === 'priority-cell') {
			isFormValid(e) && handleFormSubmit
				? handleFormSubmit(e)
				: alert("Priority input's integer value is invalid.");
		} else {
			const newFormData: EditFormData = {
				...addFormData,
				priority: `${addFormData?.letterPriority}${addFormData?.numberPriority}`,
				letterPriority: '',
				numberPriority: '',
			};
			isFormValid(e) && setAddFormData
				? setAddFormData(newFormData)
				: alert("Priority input's integer value is invalid.");
		}
		setTimeout(() => {
			setState &&
				setState({ isModal: false, isLoading: false, httpError: null });
		}, 250);
	};

	const radioRef = useRef<HTMLInputElement>(null);

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
						onChange={letterPriorityHandler}
						onTouchStart={letterPriorityHandler}
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
						onChange={letterPriorityHandler}
						onTouchStart={letterPriorityHandler}
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
						onChange={letterPriorityHandler}
						onTouchStart={letterPriorityHandler}
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
					onChange={numberPriorityHandler}
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
				onTouchStart={(event) => updatePriorityHandler(event)}
				onClick={(event) => updatePriorityHandler(event)}
				disabled={letterPriority ? false : true}
			>
				CONFIRM PRIORITY
			</Button>
		</form>
	);
};

export default UpdateTaskPriority;
