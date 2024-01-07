import { Task } from '../../../ts/types';
import { Menu } from '../../../ts/interfaces';
import { TaskActionType } from '../../../ts/enums';

export const handleMenuItemEvent = (options: Menu) => {
	const {
		editTask,
		rowId,
		setEditTask,
		editFormData,
		setEditFormData,
		sortList,
		tasks,
		taskDispatch
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
			const index = tasks.findIndex((task) => task.id === rowId);

			taskDispatch({
				type: TaskActionType.REMOVE,
				index: index,
			});

			localStorage.removeItem(rowId!.toString());
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
			id: rowId,
			status: menuValue || null,
			priority: menuValue !== 'Completed' ? editFormData.priority! : '',
			description: editFormData.description,
		};

		const newTasks = [...tasks];
		const index = tasks.findIndex((task) => task.id === rowId);
		newTasks[index] = editedTask;
		taskDispatch({
			type: TaskActionType.SET,
			data: newTasks,
		});

		localStorage.setItem(rowId!.toString(), JSON.stringify(editedTask as string));
		setEditTask({ ...editTask, showMenu: false });
		sortList(newTasks);
	};
};
