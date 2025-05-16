import { Reducer } from 'react';
import sortList from './utilities/sortList';
import { Task, TaskActionShape } from './ts/types';
import { TaskActionType } from './ts/enums';
import axios from 'axios';

export const TaskService = {
  async fetchTasks() {
    const response = await axios.get('/api/v1/tasks');
    return response.data.tasks.map((task: any) => ({
      id: task._id,
      status: task.status,
      priority: task.priority,
      description: task.description,
    }));
  },

  async addTask(task: Omit<Task, 'id'>) {
    const response = await axios.post('/api/v1/tasks', task);
    return {
      id: response.data.task._id,
      status: response.data.task.status,
      priority: response.data.task.priority,
      description: response.data.task.description,
    };
  },

  async updateTask(id: string, taskData: Partial<Task>) {
    const response = await axios.put(`/api/v1/tasks/${id}`, taskData);
    return {
      id: response.data.task._id,
      status: response.data.task.status,
      priority: response.data.task.priority,
      description: response.data.task.description,
    };
  },

  async deleteTask(id: string) {
    await axios.delete(`/api/v1/tasks/${id}`);
    return id;
  }
};


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
      return state.filter((_, index) => index !== action.index);
    default:
      return state;
  }
};
