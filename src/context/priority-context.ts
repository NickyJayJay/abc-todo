import { createContext } from 'react';
import { EditFormData, EditTask } from '../ts/interfaces';
import { Task } from '../ts/types';
import { TaskActionShape } from '../ts/types';
import { Options } from '../components/App/handlers';

interface PriorityContextShape {
	inputType?: string | null;
	editFormData?: EditFormData;
	setEditFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
	addFormData: EditFormData;
	setAddFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
	letterPriority?: string;
	numberPriority?: string;
	handleFormSubmit: (options: Options) => (e: React.FormEvent) => void;
	toggleModal: () => void;
	editTask: EditTask;
	tasks: Task[];
	taskDispatch: React.Dispatch<TaskActionShape>;
}

export const PriorityContext = createContext({} as PriorityContextShape);
