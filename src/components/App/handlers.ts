import { Database, DatabaseReference } from 'firebase/database';
import React from 'react';

import { TaskActionType } from '../../ts/enums';
import { EditFormData, EditTask } from '../../ts/interfaces';
import { Task, TaskActionShape } from '../../ts/types';

export interface Options {
    editTask?: EditTask;
    editFormData?: EditFormData;
    tasks?: Task[];
    taskDispatch?: React.Dispatch<TaskActionShape>;
    sortList?: (a: Task[]) => void;
    ref?: (a: Database, b: string) => DatabaseReference;
    db?: Database;
    update?: (a: DatabaseReference, b: object) => Promise<void>;
}

export const handleFormSubmit = (options: Options) => {
    const { editTask, editFormData, tasks, taskDispatch, sortList, ref, db, update }: Options = options;

    return (e: React.FormEvent) => {
        e.preventDefault();

        const editedTask = {
            id: editTask!.rowId,
            status: editFormData!.status,
            priority: editFormData!.priority,
            description: editFormData!.description,
        };

        const newTasks = [...tasks!];
        const index = tasks!.findIndex((task) => task.id === editTask!.rowId);
        newTasks[index] = editedTask;

        taskDispatch && taskDispatch({
            type: TaskActionType.SET,
            data: newTasks,
        });

        sortList && sortList(newTasks);

        const dbRef = ref && ref(db!, `tasks/${editTask!.rowId}`);
        update && update(dbRef!, editedTask);
    };
};