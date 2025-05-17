import { Task } from '../../../ts/types';
import { Menu, EditTask } from '../../../ts/interfaces';
import { TaskActionType } from '../../../ts/enums';
import { TaskService } from '../../../reducers';

export const handleMenuItemEvent = (options: Menu) => {
  const { editTask, rowId, setEditTask, editFormData, sortList, tasks, taskDispatch, enableDB }: Menu =
    options;

  const handleRemoveTask = async (id: Task["id"], index: number) => {
    try {
      if (enableDB) {
        await TaskService.deleteTask(id);
      } else {
        const newTasks = tasks.filter((_, i) => i !== index);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
      }
      taskDispatch({ type: TaskActionType.REMOVE, index, id });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (editedTask: Task, editTask: EditTask) => {
    try {
      if (enableDB) {
        taskDispatch({
          type: TaskActionType.UPDATE,
          payload: editedTask
        });

        await TaskService.updateTask(editTask.rowId, editedTask);

      } else {
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
      }
      setEditTask({ ...editTask, showMenu: false });
    } catch (error) {
      console.error(error);
    }
  }

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

      handleRemoveTask(rowId, index);

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

    if (menuValue !== 'Remove' && menuValue !== 'Cancel') {
      handleUpdateStatus(editedTask, editTask);
    }
  };
};
