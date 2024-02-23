import { useRef, useEffect, useContext } from 'react';

import classes from '../App/App.module.scss';
import { Task } from '../../ts/types';
import {
  handleEditTask,
  handleEditFormKeyboard,
} from '../App/handlers';
import { MainContext } from '../../context/main-context';

const Priority = ({ task }: { task: Task }) => {
  const {
    isModal,
    editTask,
    editFormData,
    setEditFormData,
    tasks,
    taskDispatch,
    toggleModal,
    setEditTask,
  } = useContext(MainContext);

  const dependencies = {
    isModal,
    editTask,
    editFormData,
    setEditFormData,
    task,
    tasks,
    taskDispatch,
    toggleModal,
    setEditTask,
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    task.id === editTask.rowId &&
      editTask.inputType === 'priority-cell' &&
      !isModal &&
      buttonRef.current?.focus();
  }, [editTask, task.id, isModal]);

  return (
    <td
      data-id="priority-cell"
      className={
        task.id === editTask.rowId &&
        editTask.inputType === 'priority-cell'
          ? `${classes.priority} ${classes.active}`
          : classes.priority
      }
    >
      <button
        data-id="priority-cell"
        aria-label="priority"
        onClick={(event) => handleEditTask(event, dependencies)}
        onKeyUp={(event) => handleEditTask(event, dependencies)}
        onKeyDown={(event) =>
          handleEditFormKeyboard(event, dependencies)
        }
        ref={buttonRef}
        className={
          task.status === 'Completed'
            ? classes.completed
            : '' || task.status === 'Forwarded'
            ? classes.forwarded
            : ''
        }
      >
        {task.status !== 'Completed' &&
          task.status !== 'Forwarded' &&
          task.priority}
      </button>
    </td>
  );
};

export default Priority;
