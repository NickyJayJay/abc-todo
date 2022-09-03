import { ChangeEvent, createContext } from 'react';
import { EditFormData, EditTask, ErrorsAndLoading } from '../ts/interfaces';

interface PriorityContextShape {
	editTask: EditTask;
	editFormData: EditFormData;
	setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
	addFormData: EditFormData;
	setAddFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
	setState: React.Dispatch<React.SetStateAction<ErrorsAndLoading>>;
	letterPriority: string;
	numberPriority: string;
	editMode: string | null | undefined;
	handleEditFormSubmit: (e: React.FormEvent) => void;
	handleAddFormChange: (
		e: ChangeEvent<Element> | React.FormEvent<HTMLFormElement>
	) => void;
}

export const PriorityContext = createContext({} as PriorityContextShape);
