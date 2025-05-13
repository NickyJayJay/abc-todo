import React, { useRef, useEffect, useContext } from 'react';

import classes from '../App/App.module.scss';
import checkmark from '../../assets/SVG/checkmark.svg';
import add from '../../assets/SVG/add.svg';
import arrow from '../../assets/SVG/arrow-right-gray.svg';
import checkBox from '../../assets/SVG/checkBox-gray.svg';
import trash from '../../assets/SVG/trash-black.svg';
import dot from '../../assets/SVG/dot.svg';
import { Task } from '../../ts/types';
import { handleEditTask } from '../App/handlers';
import { MainContext } from '../../context/main-context';

interface Props {
  task: Task;
  setX: (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => string | null;
  setY: (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => string | null;
}

const Status = ({ task, setX, setY }: Props) => {
  const { editTask, setEditTask, setEditFormData } = useContext(MainContext);

  const dependencies = {
    setEditTask,
    task,
    setX,
    setY,
    setEditFormData,
  };

  const cellRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    task.id === editTask.rowId &&
      editTask.inputType === 'status-cell' &&
      !editTask.showMenu &&
      cellRef.current?.focus();
  }, [editTask, task.id]);

  const showStatus = !task.previewStatus;

  return (
    <td
      data-id='status-cell'
      className={
        task.id === editTask.rowId &&
          editTask.inputType === 'status-cell' &&
          task.previewStatus !== "Remove" &&
          task.previewStatus !== "Completed" &&
          task.previewStatus !== "Forwarded"
          ? `${classes.status} ${classes.active}`
          : classes.status
      }
      ref={cellRef}
    >
      <button
        data-id='status-cell'
        aria-label='status'
        onClick={(event) => handleEditTask(event, dependencies)}
        onKeyDown={(event) => handleEditTask(event, dependencies)}
      >
        {(
          (task.status === 'In Process' && showStatus) ||
          (task.previewStatus === 'In Process')
        ) && (
            <img src={dot} alt='in process icon' data-id='status-cell' />
          )}
        {((task.status === 'Completed' && showStatus) ||
          (task.previewStatus === 'Completed')) && (
            <img src={checkmark} alt='completed icon' data-id='status-cell' />
          )}
        {((task.status === 'Forwarded' && showStatus) ||
          (task.previewStatus === 'Forwarded')) && (
            <img src={arrow} alt='forwarded icon' data-id='status-cell' />
          )}
        {(
          (task.status === 'Delegated' && showStatus) ||
          (task.previewStatus === 'Delegated')
        ) && (
            <img src={add} alt='delegated icon' data-id='status-cell' />
          )}

        {task.previewStatus === 'Remove'
          && (
            <img width="20" height="20" src={trash} alt='remove icon' data-id='status-cell' />
          )}
        {task.id === editTask.rowId && editTask.inputType === 'status-cell' && !task.previewStatus && !task.status && (
          <img
            width='20'
            height='20'
            src={checkBox}
            alt='placeholder icon'
            data-id='status-cell'
          />
        )}
      </button>
    </td>
  );
};

export default Status;
