import { createContext } from 'react';
import { EditFormData } from '../ts/interfaces';

interface PriorityContextShape {
	inputType?: string | null;
	editFormData?: EditFormData;
	setEditFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
	addFormData: EditFormData;
	setAddFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
	letterPriority?: string;
	numberPriority?: string;
	handleFormSubmit?: (e: React.FormEvent) => void;
	toggleModal: () => void;
}

export const PriorityContext = createContext({} as PriorityContextShape);
