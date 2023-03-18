import React from 'react';

import { TaskActionType } from '../../ts/enums';
import { EditFormData, EditTask } from '../../ts/interfaces';
import { Task, TaskActionShape } from '../../ts/types';
import sortList from '../../utilities/sortList';
import { db } from '../../firebaseConfig';
import { ref, update } from 'firebase/database';

export interface Options {
    editTask: EditTask;
    editFormData: EditFormData;
    tasks: Task[];
    taskDispatch: React.Dispatch<TaskActionShape>;
}

export const handleFormSubmit = (options: Options) => {
    const { editTask, editFormData, tasks, taskDispatch }: Options = options;

    return (e: React.FormEvent) => {
        e.preventDefault();

        const editedTask = {
            id: editTask.rowId,
            status: editFormData!.status,
            priority: editFormData!.priority,
            description: editFormData!.description,
        };

        const newTasks = [...tasks];
        const index = tasks.findIndex((task) => task.id === editTask.rowId);
        newTasks[index] = editedTask;

        taskDispatch({
            type: TaskActionType.SET,
            data: newTasks,
        });

        sortList(newTasks);

        const dbRef = ref(db, `tasks/${editTask.rowId}`);
        update(dbRef, editedTask);
    };
};