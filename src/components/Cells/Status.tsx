import React, { useRef, useEffect } from 'react';

import classes from '../App/App.module.scss';
import checkmark from '../../assets/SVG/checkmark.svg';
import add from '../../assets/SVG/add-gray.svg';
import arrowRight from '../../assets/SVG/arrow-right-gray.svg';
import dot from '../../assets/SVG/dot.svg';
import { Task } from '../../ts/types';
import { EditFormData, EditTask } from '../../ts/interfaces';
import { Options } from '../App/handlers';
interface Props {
  handleEditTask: (
    e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
    options?: Options
  ) => void;
  task: Task;
  editTask: EditTask;
  toggleModal: () => void;
  setEditTask?: React.Dispatch<React.SetStateAction<EditTask>>;
  setX: (
    e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent
  ) => string | null;
  setY: (
    e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent
  ) => string | null;
  setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

const Status = ({
  handleEditTask,
  task,
  editTask,
  toggleModal,
  setEditTask,
  setX,
  setY,
  setEditFormData,
}: Props) => {
  const cellRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    task.id === editTask.rowId &&
      editTask.inputType === 'status-cell' &&
      !editTask.showMenu &&
      cellRef.current?.focus();
  }, [editTask, task.id]);

  return (
    <td
      data-id="status-cell"
      className={
        task.id === editTask.rowId &&
        editTask.inputType === 'status-cell'
          ? `${classes.status} ${classes.active}`
          : classes.status
      }
      ref={cellRef}
    >
      <button
        data-id="status-cell"
        aria-label="status"
        onClick={(event) =>
          handleEditTask(event, {
            toggleModal,
            setEditTask,
            task,
            setX,
            setY,
            setEditFormData,
          })
        }
        onKeyDown={(event) =>
          handleEditTask(event, {
            toggleModal,
            setEditTask,
            task,
            setX,
            setY,
            setEditFormData,
          })
        }
      >
        {task.status === 'In Process' && (
          <img
            src={dot}
            alt="in process icon"
            data-id="status-cell"
          />
        )}
        {task.status === 'Completed' && (
          <img
            src={checkmark}
            alt="completed icon"
            data-id="status-cell"
          />
        )}
        {task.status === 'Forwarded' && (
          <img
            src={arrowRight}
            alt="forwarded icon"
            data-id="status-cell"
          />
        )}
        {task.status === 'Delegated' && (
          <img src={add} alt="delegated icon" data-id="status-cell" />
        )}
      </button>
    </td>
  );
};

export default Status;
