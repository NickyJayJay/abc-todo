import React, { ChangeEvent } from 'react';
import { nanoid } from 'nanoid';

import { EditFormData } from '../../ts/interfaces';
import { TaskActionShape } from '../../ts/types';
import { TaskActionType } from '../../ts/enums';

export interface Options {
	addFormData?: EditFormData;
	taskDispatch?: React.Dispatch<TaskActionShape>;
	setAddFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
	inputType?: string | null;
	toggleModal?: () => void;
}

export const handleAddFormSubmit = (options: Options) => {
	const { taskDispatch, addFormData, setAddFormData }: Options = options;

	return (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const taskId = nanoid();

		taskDispatch && taskDispatch({
			type: TaskActionType.ADD,
			payload: {
				id: taskId,
				status: addFormData!.status,
				priority: addFormData!.priority,
				description: addFormData!.description,
			},
		});

		setAddFormData && setAddFormData({
			status: 'Select Status',
			letterPriority: '',
			numberPriority: '',
			priority: '',
			description: '',
		});

		localStorage.setItem(taskId, JSON.stringify({
			status: addFormData!.status,
			priority: addFormData!.priority,
			description: addFormData!.description,
		}));
	};
};

export const handleAddFormKeydown = (options: Options) => {
	const { inputType, toggleModal }: Options = options;

	return (e: React.KeyboardEvent | ChangeEvent) => {
		(e as React.KeyboardEvent).key === 'Enter' && e.preventDefault();

		const focusableElements = document.querySelectorAll(
			'a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
		);
		const i = Array.from(focusableElements).indexOf(e.target as HTMLElement);
		const nextFocusableEl = focusableElements[i + 1];
		const prevFocusableEl = focusableElements[i - 1];

		if (!nextFocusableEl || !prevFocusableEl) return;

		if (
			inputType === 'priority-input' &&
			(e as React.KeyboardEvent).key !== 'Tab' &&
			!(e as React.KeyboardEvent).shiftKey
		) {
			e.preventDefault();
			toggleModal && toggleModal();
		} else if (
			((inputType === 'priority-input' || inputType === 'status-input') &&
				(e as React.KeyboardEvent).key) === 'Tab' &&
			!(e as React.KeyboardEvent).shiftKey
		) {
			e.preventDefault();
			(nextFocusableEl as HTMLElement).click();
			(nextFocusableEl as HTMLElement).focus();
		} else if (
			(e as React.KeyboardEvent).key === 'Tab' &&
			(e as React.KeyboardEvent).shiftKey
		) {
			e.preventDefault();
			(prevFocusableEl as HTMLElement).click();
		}
	};
};

export const handlePriorityEvent = (options: Options) => {
	const { toggleModal }: Options = options;

	return (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault();
		(e as React.MouseEvent).clientX !== 0 &&
			(e as React.MouseEvent).clientY !== 0 &&
			toggleModal && toggleModal();
	};
};

export const handleAddFormChange = (options: Options) => {
	const { addFormData, setAddFormData }: Options = options;

	return (e: ChangeEvent<Element> | React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const fieldName = (e.target as HTMLInputElement).getAttribute('name');
		if (!fieldName) return;
		const fieldValue = (e.target as HTMLInputElement).value;

		const newFormData = { ...addFormData };
		newFormData[fieldName as keyof typeof newFormData] = fieldValue;

		setAddFormData && setAddFormData(newFormData);
	};
};
