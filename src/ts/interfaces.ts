import { Database, DatabaseReference } from 'firebase/database';
import { Task, TaskActionShape } from './types';
export interface EditTask {
	rowId: string | null;
	inputType?: string | null;
	xPos?: string | null;
	yPos: string | null;
	xPosTouch: string | null;
	yPosTouch: string | null;
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
	isModal?: boolean;
}
export interface Menu {
	editTask: EditTask;
	setEditTask: (a: React.SetStateAction<EditTask>) => void;
	editFormData: EditFormData;
	setEditFormData: (a: React.SetStateAction<EditFormData>) => void;
	sortList: (a: Task[]) => void;
	tasks: Task[];
	taskDispatch: (a: TaskActionShape) => void;
	ref: (a: Database, b: string) => DatabaseReference;
	db: Database;
	update: (a: DatabaseReference, b: object) => Promise<void>;
	remove: (a: DatabaseReference) => Promise<void>;
}
