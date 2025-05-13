import { Task } from '../../../ts/types';
import { Menu } from '../../../ts/interfaces';
import { TaskActionType } from '../../../ts/enums';

export const handleMenuItemEvent = (options: Menu) => {
  const { editTask, rowId, setEditTask, editFormData, sortList, tasks, taskDispatch }: Menu =
    options;

  return (e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent) => {
    e.stopPropagation();
    if ((e as React.KeyboardEvent).key === 'Tab' || (e as React.KeyboardEvent).key === 'Shift')
      return;
    let menuValue;

    if (e.type === 'click' && (e.target as HTMLElement).tagName === 'SPAN') {
      menuValue = (e.target as HTMLElement).textContent;
    } else if (e.type === 'click' && (e.target as HTMLElement).tagName === 'IMG') {
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

      localStorage.setItem('tasks', JSON.stringify(tasks));
      setEditTask({ ...editTask, showMenu: false });
      return;
    }

    if (menuValue === 'Cancel') {
      setEditTask({ ...editTask, showMenu: false });
      return;
    }

    const editedTask: Task = {
      id: rowId,
      status: menuValue || null,
      priority:
        menuValue !== 'Completed' && menuValue !== 'Forwarded' ? editFormData.priority! : '',
      description: editFormData.description,
    };

    const newTasks = [...tasks];
    const index = tasks.findIndex((task) => task.id === rowId);
    newTasks[index] = editedTask;
    taskDispatch({
      type: TaskActionType.SET,
      data: newTasks,
    });

    localStorage.setItem('tasks', JSON.stringify(newTasks));
    setEditTask({ ...editTask, showMenu: false });
    sortList(newTasks);
  };
};
