import { ref, update } from 'firebase/database';

import { db } from '../../firebaseConfig';
import { EditTask, EditFormData } from '../../ts/interfaces';
import { Task, TaskActionShape } from '../../ts/types';
import { TaskActionType } from '../../ts/enums';
import sortList from '../../utilities/sortList';

interface Options {
	editTask: EditTask;
	editFormData: EditFormData;
	tasks: Task[];
	taskDispatch: (value: TaskActionShape) => void;
}

export const handleFormSubmit = (options: Options) => {
	const { editTask, editFormData, tasks, taskDispatch }: Options = options;

	return (e: React.FormEvent) => {
		e.preventDefault();

		const editedTask = {
			id: editTask.rowId,
			status: editFormData.status,
			priority: editFormData.priority,
			description: editFormData.description,
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
