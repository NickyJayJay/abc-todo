import { useContext } from 'react';
import Button from '../Button/Button';
import { MainContext } from '../../../context/main-context';
import { Task } from '../../../ts/types';
import { TaskActionType } from '../../../ts/enums';

interface MenuItems {
  status: string;
  src: string;
  alt: string;
  onClick: (
    e:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.TouchEvent<Element>
  ) => void;
}

const MenuItem = ({ status, src, alt, onClick }: MenuItems) => {
  const {
    rowId,
    tasks,
    taskDispatch,
    editFormData,
  } = useContext(MainContext);

  const updatepreviewStatus = (status?: string) => {
    const editedTask: Task = {
      id: rowId,
      status: editFormData.status,
      previewStatus: status,
      priority: editFormData.priority!,
      description: editFormData.description,
    };

    const newTasks = [...tasks];
    const index = tasks.findIndex((task) => task.id === rowId);
    newTasks[index] = editedTask;
    taskDispatch({
      type: TaskActionType.SET,
      data: newTasks,
    });
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatepreviewStatus(status);
  };

  const handleOnKeyUp = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    updatepreviewStatus(status);
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatepreviewStatus("");
  };

  return (
    <li
      role="menuitem"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyUp={handleOnKeyUp}
    >
      <Button onClick={onClick}>
        <span>{status}</span>
        <img src={src} alt={alt} />
      </Button>
    </li>
  );
};

export default MenuItem;
