import { ChangeEvent } from 'react';

import { EditFormData } from '../../ts/interfaces';
export interface Options {
	editFormData: EditFormData;
	setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

export const handleEditFormChange = (options: Options) => {
	const { editFormData, setEditFormData }: Options = options;

	return (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const fieldName = e.target.getAttribute('name');
		const fieldValue = e.target.value;

		const newFormData = { ...editFormData };
		newFormData[fieldName as keyof typeof newFormData] = fieldValue;

		setEditFormData(newFormData);
	};
};
