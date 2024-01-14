import React from 'react';

import classes from '../App/App.module.scss';
import { Task } from '../../ts/types';
import { Options } from '../App/handlers';
import { EditFormData, EditTask } from '../../ts/interfaces';
interface Props {
  handleEditTask: (
    e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
    options?: Options
  ) => void;
  task: Task;
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

const DescriptionReadOnly = ({
  handleEditTask,
  toggleModal,
  setEditTask,
  task,
  setX,
  setY,
  setEditFormData,
}: Props) => {
  return (
    <td
      data-id="description-cell"
      className={classes.description}
      /* commenting out below because of error: "Unable to preventDefault inside passive event listener due to target being treated as passive." Working in simulator but need to test on mobile devices before removing.  */
      //   onTouchStart={(event) =>
      //     handleEditTask(event, {
      //       toggleModal,
      //       setEditTask,
      //       task,
      //       setX,
      //       setY,
      //       setEditFormData,
      //     })
      //   }
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
      onKeyUp={(event) =>
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
      <button
        data-id="description-cell"
        aria-label="description"
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
        {task.description}
      </button>
    </td>
  );
};

export default DescriptionReadOnly;
