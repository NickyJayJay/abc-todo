import { useRef, useEffect, useContext } from 'react';

import classes from '../App/App.module.scss';
import { Task } from '../../ts/types';
import { handleEditTask, handleEditFormKeyboard } from '../App/handlers';
import { MainContext } from '../../context/main-context';

const Priority = ({ task }: { task: Task }) => {
  const {
    editFormData,
    editTask,
    inputType,
    isModal,
    letterPriority,
    numberPriority,
    rowId,
    setEditFormData,
    setEditTask,
    taskDispatch,
    tasks,
    toggleModal,
  } = useContext(MainContext);

  const dependencies = {
    editFormData,
    editTask,
    isModal,
    setEditFormData,
    setEditTask,
    task,
    taskDispatch,
    tasks,
    toggleModal,
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  const isCompleted = task.status === 'Completed';
  const isForwarded = task.status === 'Forwarded';
  const isPriorityCell = inputType === 'priority-cell';
  const isActiveTask = task.id === rowId;
  const togglePreview =
    !isModal ||
    !isActiveTask ||
    (isPriorityCell && isModal && isActiveTask && !letterPriority && !numberPriority)
      ? task.priority
      : `${letterPriority}${numberPriority}`;

  useEffect(() => {
    isActiveTask && isPriorityCell && !isModal && buttonRef.current?.focus();
  }, [editTask, task.id, isModal]);

  return (
    <td
      data-id='priority-cell'
      className={
        isActiveTask && isPriorityCell && !isCompleted && !isForwarded
          ? `${classes.priority} ${classes.active}`
          : classes.priority
      }
    >
      <button
        data-id='priority-cell'
        aria-label='priority'
        onClick={(event) => handleEditTask(event, dependencies)}
        onKeyUp={(event) => handleEditTask(event, dependencies)}
        onKeyDown={(event) => handleEditFormKeyboard(event, dependencies)}
        ref={buttonRef}
        className={isCompleted ? classes.completed : '' || isForwarded ? classes.forwarded : ''}
      >
        {togglePreview}
      </button>
    </td>
  );
};

export default Priority;
