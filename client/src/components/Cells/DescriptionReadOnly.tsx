import { useContext } from 'react';

import classes from '../App/App.module.scss';
import { Task } from '../../ts/types';
import { handleEditTask } from '../App/handlers';
import { MainContext } from '../../context/main-context';

const DescriptionReadOnly = ({ task }: { task: Task }) => {
  const { setEditTask, setEditFormData } = useContext(MainContext);

  const dependencies = {
    setEditTask,
    setEditFormData,
    task,
  };

  return (
    <td
      data-id='description-cell'
      className={classes.description}
      onClick={(event) => handleEditTask(event, dependencies)}
      onKeyUp={(event) => handleEditTask(event, dependencies)}
    >
      <button
        data-id='description-cell'
        aria-label='description'
        className={
          task.status === 'Completed'
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
