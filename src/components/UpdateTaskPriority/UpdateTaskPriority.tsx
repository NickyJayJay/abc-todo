import { useContext } from 'react';
import { MainContext } from '../../context/main-context';
import Button from '../UI/Button/Button';
import classes from './UpdateTaskPriority.module.scss';
import { letterPriorityHandler, numberPriorityHandler, updatePriorityHandler } from './handlers';

const UpdateTaskPriority = () => {
  const {
    inputType,
    editFormData,
    setEditFormData,
    addFormData,
    setAddFormData,
    letterPriority,
    numberPriority,
    toggleModal,
    editTask,
    tasks,
    taskDispatch,
  } = useContext(MainContext);

  const options = {
    inputType,
    editFormData,
    addFormData,
    letterPriority,
    numberPriority,
    setEditFormData,
    setAddFormData,
    toggleModal,
    editTask,
    tasks,
    taskDispatch,
  };

  return (
    <form
      className={classes.UpdateTaskPriority}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <h2>Update Task Priority</h2>
      <fieldset>
        <legend>First, choose a priority letter (A, B, C)</legend>
        <div className={classes.inputWrap}>
          <input
            type='radio'
            id='A'
            name='letter'
            value='A'
            onChange={letterPriorityHandler(options)}
            onTouchStart={letterPriorityHandler(options)}
            checked={letterPriority === 'A'}
          />
          <label>
            A <span>(Important and time sensitive)</span>
          </label>
        </div>
        <div className={classes.inputWrap}>
          <input
            type='radio'
            id='B'
            name='letter'
            value='B'
            onChange={letterPriorityHandler(options)}
            onTouchStart={letterPriorityHandler(options)}
            checked={letterPriority === 'B'}
          />
          <label>
            B <span>(Important but not time sensitive)</span>
          </label>
        </div>
        <div className={classes.inputWrap}>
          <input
            type='radio'
            id='C'
            name='letter'
            value='C'
            onChange={letterPriorityHandler(options)}
            onTouchStart={letterPriorityHandler(options)}
            checked={letterPriority === 'C'}
          />
          <label>
            C <span>(Not important)</span>
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Then enter a priority number (1 - 99)</legend>
        <input
          type='number'
          onChange={numberPriorityHandler(options)}
          onKeyDown={numberPriorityHandler(options)}
          name='priority'
          value={
            inputType === 'priority-cell'
              ? editFormData?.numberPriority
              : addFormData?.numberPriority
          }
        />
      </fieldset>
      <div className={classes.preview}>
        {addFormData.priority && inputType === 'priority-input'
          ? addFormData.priority
          : editFormData.priority}
      </div>
      <Button
        type='submit'
        onTouchStart={updatePriorityHandler(options)}
        onClick={updatePriorityHandler(options)}
        disabled={letterPriority ? false : true}
      >
        CONFIRM PRIORITY
      </Button>
    </form>
  );
};

export default UpdateTaskPriority;
