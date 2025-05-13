import { Reducer } from 'react';
import sortList from './utilities/sortList';
import { Task, TaskActionShape } from './ts/types';
import { TaskActionType } from './ts/enums';

export const taskReducer: Reducer<Task[], TaskActionShape> = (state = [], action) => {
  switch (action.type) {
    case TaskActionType.SET:
      return action.data;
    case TaskActionType.ADD:
      let sortedTasks = [
        ...state,
        {
          id: action.payload.id,
          status: action.payload.status,
          priority: action.payload.priority,
          description: action.payload.description,
        },
      ];

      sortList(sortedTasks);
      localStorage.setItem('tasks', JSON.stringify(sortedTasks));
      return sortedTasks;
    case TaskActionType.REMOVE:
      const newTasks = state.filter((_, index) => index !== action.index);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return newTasks;
    default:
      return state;
  }
};
