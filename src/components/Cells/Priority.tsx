import React, { useRef, useEffect } from 'react';

import classes from '../App/App.module.scss';
import { Task, TaskActionShape } from '../../ts/types';
import { EditFormData, EditTask } from '../../ts/interfaces';
import { Options } from '../App/handlers';
interface Props {
  handleEditTask: (
    e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
    options?: Options
  ) => void;
  handleEditFormKeyboard: (
    e: React.KeyboardEvent,
    options?: Options
  ) => void;
  task: Task;
  isModal: boolean;
  setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
  editFormData: EditFormData;
  editTask: EditTask;
  tasks?: Task[];
  taskDispatch?: React.Dispatch<TaskActionShape>;
  toggleModal: () => void;
  setEditTask?: React.Dispatch<React.SetStateAction<EditTask>>;
}

const Priority = ({
  handleEditTask,
  task,
  isModal,
  editTask,
  handleEditFormKeyboard,
  editFormData,
  setEditFormData,
  tasks,
  taskDispatch,
  toggleModal,
  setEditTask,
}: Props) => {
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
        onClick={(event) =>
          handleEditTask(event, {
            toggleModal,
            setEditTask,
            task,
            setEditFormData,
          })
        }
        onKeyUp={(event) =>
          handleEditTask(event, {
            toggleModal,
            setEditTask,
            task,
            setEditFormData,
          })
        }
        onKeyDown={(event) =>
          handleEditFormKeyboard(event, {
            editTask,
            editFormData,
            tasks,
            taskDispatch,
            setEditFormData,
          })
        }
        ref={buttonRef}
        className={
          task.status === 'Delegated'
            ? classes.delegated
            : '' || task.status === 'Completed'
            ? classes.completed
            : '' || task.status === 'Forwarded'
            ? classes.forwarded
            : ''
        }
      >
        {task.status !== 'Completed' &&
          task.status !== 'Delegated' &&
          task.status !== 'Forwarded' &&
          task.priority}
      </button>
    </td>
  );
};

export default Priority;
