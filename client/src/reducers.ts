import { Reducer } from 'react';
import sortList from './utilities/sortList';
import { Task, TaskActionShape } from './ts/types';
import { TaskActionType } from './ts/enums';
import axios from 'axios';

export const TaskService = {
  async fetchTasks() {
    return await axios.get('/api/v1/tasks');
  },

  async addTask(task: Task) {
    return await axios.post('/api/v1/tasks', task);
  },

  async addTasks(tasks: Task[]) {
    return await axios.post('/api/v1/tasks', tasks);
  },

  async updateTask(id?: string | null, taskData?: Partial<Task>) {
    return await axios.put(`/api/v1/tasks/${id}`, taskData);
  },

  async deleteTask(id?: string | null) {
    return await axios.delete(`/api/v1/tasks/${id}`);
  }
};

export const taskReducer: Reducer<Task[], TaskActionShape> = (state = [], action) => {
  switch (action.type) {
    case TaskActionType.SET:
      return action.data;
    case TaskActionType.ADD:
      const sortedTasks = [
        ...state,
        {
          id: action.payload.id,
          status: action.payload.status,
          priority: action.payload.priority,
          description: action.payload.description,
        },
      ];

      sortList(sortedTasks);
      return sortedTasks;
    case TaskActionType.REMOVE:
      return state.filter((_, index) => index !== action.index);
    case TaskActionType.UPDATE:
      const tasks = [...state];
      const updatedTask = {
        id: action.payload.id,
        status: action.payload.status,
        priority: action.payload.priority,
        description: action.payload.description,
      }
      const index = tasks!.findIndex((task) => task.id === updatedTask.id);
      tasks[index] = updatedTask;
      sortList(tasks);
      return tasks;
    default:
      return state;
  }
};
