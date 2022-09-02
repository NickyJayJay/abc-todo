import { Task } from './types';
import { TaskActionType } from './enums';
export interface EditTask {
	rowId: string | null;
	inputType: string | null | undefined;
	xPos?: string | null;
	yPos: string | null;
	xPosTouch: string | null;
	yPosTouch: string | null;
	showMenu: boolean;
}

export interface EditFormData {
	status: string | null;
	letterPriority: string;
	numberPriority: string;
	priority: string | null;
	description: string | null;
}
export interface ErrorsAndLoading {
	isLoading?: boolean;
	httpError?: string | null;
	isError?: boolean;
}
