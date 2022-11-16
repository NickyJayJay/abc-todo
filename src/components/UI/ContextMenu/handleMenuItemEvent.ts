import { Task } from '../../../ts/types';
import { Menu } from '../../../ts/interfaces';
import { TaskActionType } from '../../../ts/enums';

export const handleMenuItemEvent = (options: Menu) => {
	const {
		editTask,
		setEditTask,
		editFormData,
		setEditFormData,
		sortList,
		tasks,
		taskDispatch,
		ref,
		db,
		update,
		remove,
	}: Menu = options;

	return (e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent) => {
		e.stopPropagation();
		if (
			(e as React.KeyboardEvent).key === 'Tab' ||
			(e as React.KeyboardEvent).key === 'Shift'
		)
			return;
		let menuValue;

		if (e.type === 'click' && (e.target as HTMLElement).tagName === 'SPAN') {
			menuValue = (e.target as HTMLElement).textContent;
		} else if (
			e.type === 'click' &&
			(e.target as HTMLElement).tagName === 'IMG'
		) {
			menuValue = (e.target as HTMLElement).previousElementSibling?.textContent;
		} else {
			menuValue = (e.target as HTMLElement).childNodes[0].textContent;
		}

		if (menuValue === 'Remove') {
			const index = tasks.findIndex((task) => task.id === editTask.rowId);

			taskDispatch({
				type: TaskActionType.REMOVE,
				index: index,
			});
			const dbRef = ref(db, `tasks/${editTask.rowId}`);
			remove(dbRef);
			setEditTask({ ...editTask, showMenu: false });
			return;
		}

		if (menuValue === 'Cancel') {
			setEditTask({ ...editTask, showMenu: false });
			return;
		}

		if (menuValue === 'Completed') {
			setEditFormData({ ...editFormData, priority: '' });
		}

		const editedTask: Task = {
			id: editTask.rowId,
			status: menuValue || null,
			priority: menuValue !== 'Completed' ? editFormData.priority! : '',
			description: editFormData.description,
		};

		const newTasks = [...tasks];
		const index = tasks.findIndex((task) => task.id === editTask.rowId);
		newTasks[index] = editedTask;
		taskDispatch({
			type: TaskActionType.SET,
			data: newTasks,
		});
		const dbRef = ref(db, `tasks/${editTask.rowId}`);
		update(dbRef, editedTask);

		setEditTask({ ...editTask, showMenu: false });
		sortList(newTasks);
	};
};
