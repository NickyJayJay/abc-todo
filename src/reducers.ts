import { Reducer } from 'react';
import { Task, TaskActionShape } from './ts/types';
import { TaskActionType } from './ts/enums';

export const taskReducer: Reducer<Task[], TaskActionShape> = (
	state = [],
	action
) => {
	switch (action.type) {
		case TaskActionType.SET:
			return action.data;
		case TaskActionType.ADD:
			return [
				...state,
				{
					id: action.payload.id,
					key: action.payload.key,
					status: action.payload.status,
					priority: action.payload.priority,
					description: action.payload.description,
				},
			];
		case TaskActionType.REMOVE:
			return state.filter((_, index) => index !== action.index);
		default:
			return state;
	}
};
