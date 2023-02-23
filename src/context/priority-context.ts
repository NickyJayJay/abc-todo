import { createContext } from 'react';
import { EditFormData, ErrorsAndLoading } from '../ts/interfaces';
import { Task, TaskActionShape } from '../ts/types';

interface PriorityContextShape {
	inputType?: string | null;
	editFormData?: EditFormData;
	setEditFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
	addFormData: EditFormData;
	setAddFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
	setState?: React.Dispatch<React.SetStateAction<ErrorsAndLoading>>;
	letterPriority?: string;
	numberPriority?: string;
	editMode?: string | null;
	handleFormSubmit?: (e: React.FormEvent) => void;
	tasks?: Task[];
	taskDispatch?: React.Dispatch<TaskActionShape>;
	isModal?: boolean;
	setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PriorityContext = createContext({} as PriorityContextShape);
