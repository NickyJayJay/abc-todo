import { TaskActionType } from './enums';

export type Task = {
	id: string | null;
	key?: string | null;
	status?: string | null;
	priority?: string | null;
	description?: string | null;
};

export type SetTaskAction = {
	type: TaskActionType.SET;
	data: Task[];
};

export type AddTaskAction = {
	type: TaskActionType.ADD;
	payload: Task;
};

export type RemoveTaskAction = {
	type: TaskActionType.REMOVE;
	index: number | null;
};

export type TaskActionShape = SetTaskAction | AddTaskAction | RemoveTaskAction;
