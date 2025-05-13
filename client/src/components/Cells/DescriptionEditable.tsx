import { useEffect, useRef, useContext } from 'react';

import classes from '../App/App.module.scss';
import { handleEditFormChange } from '../TableForm/handlers';
import { Task } from '../../ts/types';
import { MainContext } from '../../context/main-context';
import {
  handleFormSubmit,
  handleEditFormKeyboard,
} from '../App/handlers';

const DescriptionEditable = ({ task }: { task: Task }) => {
  const {
    setEditFormData,
    rowId,
    inputType,
    editFormData,
    editTask,
    tasks,
    taskDispatch,
  } = useContext(MainContext);

  const dependencies = {
    setEditFormData,
    rowId,
    inputType,
    editFormData,
    editTask,
    tasks,
    task,
    taskDispatch,
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <td
      data-id="description-cell"
      className={
        task.id === rowId && inputType === 'description-cell'
          ? `${classes.description} ${classes.active}`
          : classes.description
      }
    >
      <input
        type="text"
        placeholder="Enter a task description..."
        name="description"
        aria-label="description"
        value={editFormData.description as string}
        onChange={handleEditFormChange(dependencies)}
        onKeyDown={(event) =>
          handleEditFormKeyboard(event, dependencies)
        }
        onBlur={(event) => handleFormSubmit(event, dependencies)}
        ref={inputRef}
        maxLength={150}
      ></input>
    </td>
  );
};

export default DescriptionEditable;
