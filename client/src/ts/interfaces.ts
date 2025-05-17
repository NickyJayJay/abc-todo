import { Task, TaskActionShape } from './types';
export interface EditTask {
	rowId?: string | null;
	inputType?: string | null;
	xPos?: string | null;
	yPos?: string | null;
	showMenu: boolean;
}

export interface EditFormData {
	status?: string | null;
	letterPriority?: string;
	numberPriority?: string;
	priority?: string | null;
	description?: string | null;
}
export interface ErrorsAndLoading {
	isLoading?: boolean;
	httpError?: string | null;
}
export interface Menu {
	editTask: EditTask;
	rowId?: string | null;
	setEditTask: (a: React.SetStateAction<EditTask>) => void;
	editFormData: EditFormData;
	setEditFormData: (a: React.SetStateAction<EditFormData>) => void;
	sortList: (a: Task[]) => void;
	tasks: Task[];
	taskDispatch: (a: TaskActionShape) => void;
	enableDB: boolean;
}
