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
    isModalRendered,
    letterPriority,
    numberPriority,
    rowId,
    setEditFormData,
    setEditTask,
    taskDispatch,
    tasks,
    showModal,
  } = useContext(MainContext);

  const dependencies = {
    editFormData,
    editTask,
    isModalRendered,
    setEditFormData,
    setEditTask,
    task,
    taskDispatch,
    tasks,
    showModal,
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  const isCompleted = task.status === 'Completed';
  const isForwarded = task.status === 'Forwarded';
  const isCompletedOrForwardedPreview = task.previewStatus === 'Completed' || task.previewStatus === 'Forwarded';
  const isPriorityCell = inputType === 'priority-cell';
  const isActiveTask = task.id === rowId;

  let togglePreview;

  if (isPriorityCell && isModalRendered && isActiveTask && (letterPriority || numberPriority)) {
    togglePreview = `${letterPriority}${numberPriority}`;
  } else if (
    (isPriorityCell &&
      isModalRendered &&
      isActiveTask &&
      !letterPriority &&
      !numberPriority &&
      !isCompleted &&
      !isForwarded &&
      !task.priority) ||
    (isPriorityCell && !isModalRendered && isActiveTask && !task.priority && !isCompleted && !isForwarded)
  ) {
    togglePreview = (
      <span data-id='priority-cell' style={{ color: '#808080', fontWeight: '400' }}>
        ABC
      </span>
    );
  } else if (isCompletedOrForwardedPreview) {
    togglePreview = '';
  } else {
    togglePreview = task.priority;
  }

  useEffect(() => {
    isActiveTask && isPriorityCell && !isModalRendered && buttonRef.current?.focus();
  }, [editTask, task.id, isModalRendered]);

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
