import React, { ChangeEvent } from 'react';
import { nanoid } from 'nanoid';

import { url } from '../../firebaseConfig';
import { EditFormData } from '../../ts/interfaces';
import { TaskActionShape } from '../../ts/types';
import { TaskActionType } from '../../ts/enums';

export interface Options {
	addFormData: EditFormData;
	taskDispatch: React.Dispatch<TaskActionShape>;
	setAddFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
	inputType?: string | null;
	setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handleAddFormSubmit = (options: Options) => {
	const { taskDispatch, addFormData, setAddFormData }: Options = options;

	return (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		taskDispatch({
			type: TaskActionType.ADD,
			payload: {
				id: nanoid(),
				key: nanoid(),
				status: addFormData.status,
				priority: addFormData.priority,
				description: addFormData.description,
			},
		});

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
};

export const handleAddFormKeydown = (options: Options) => {
	const { inputType, setModal }: Options = options;

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
			setModal(true);
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
	const { setModal }: Options = options;

	return (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault();
		(e as React.MouseEvent).clientX !== 0 &&
			(e as React.MouseEvent).clientY !== 0 &&
			setModal(true);
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

		setAddFormData(newFormData);
	};
};
