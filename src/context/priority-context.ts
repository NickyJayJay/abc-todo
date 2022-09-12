import { ChangeEvent, createContext } from 'react';
import { EditFormData, EditTask, ErrorsAndLoading } from '../ts/interfaces';
import { Task, TaskActionShape } from '../ts/types';

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
	handleFormSubmit: (e: React.FormEvent) => void;
	handleAddFormChange: (
		e: ChangeEvent<Element> | React.FormEvent<HTMLFormElement>
	) => void;
	tasks: Task[];
	taskDispatch: React.Dispatch<TaskActionShape>;
	isModal: boolean;
}

export const PriorityContext = createContext({} as PriorityContextShape);
