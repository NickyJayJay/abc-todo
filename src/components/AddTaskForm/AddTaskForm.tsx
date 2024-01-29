import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
} from 'react';
import Select from 'react-select';
import ButtonGradient from '../UI/Button/ButtonGradient';
import classes from '../App/App.module.scss';
import { Options } from './handlers';
import { OptionType } from '../../ts/interfaces';
import {
  handleAddFormSubmit,
  handleAddFormFocus,
  handlePriorityEvent,
  handleAddFormChange,
  handleSelectChange,
} from './handlers';

const AddTaskForm = forwardRef<HTMLInputElement, Options>(
  (
    {
      addFormData,
      taskDispatch,
      setAddFormData,
      inputType,
      toggleModal,
    },
    ref
  ) => {
    useEffect(() => {
      // inputType === 'status-input' && selectRef.current?.focus();
      inputType === 'description-input' &&
        descriptionRef.current?.focus();
    }, [inputType]);

    // const selectRef = useRef<SelectInstance<OptionType> | null>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);

    const options: Options = {
      addFormData,
      taskDispatch,
      setAddFormData,
      inputType,
      toggleModal,
    };

    const selectOptions: OptionType[] = [
      { label: 'In Process', value: 'In Process' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Forwarded', value: 'Forwarded' },
      { label: 'Delegated', value: 'Delegated' },
    ];

    return (
      <div className={classes.addTask}>
        <form onSubmit={handleAddFormSubmit(options)}>
          <fieldset>
            <legend>Add a Task</legend>
            <Select<OptionType>
              onChange={handleSelectChange(options)}
              onKeyDown={handleAddFormFocus(options)}
              name="status"
              value={addFormData.status as OptionType | undefined}
              data-id="status-input"
              aria-label="select status"
              // ref={selectRef}
              placeholder={addFormData.status as React.ReactNode}
              options={selectOptions}
            ></Select>
            <input
              type="text"
              name="priority"
              data-id="priority-input"
              placeholder="ABC"
              value={addFormData.priority as string}
              onChange={handleAddFormFocus(options)}
              onKeyDown={handleAddFormFocus(options)}
              onTouchEnd={handlePriorityEvent(options)}
              onClick={handlePriorityEvent(options)}
              aria-label="Enter task priority"
              ref={ref}
              className={
                inputType === 'priority-input' ? classes.active : ''
              }
            ></input>
            <input
              type="text"
              name="description"
              data-id="description-input"
              placeholder="Enter task description..."
              value={addFormData.description as string}
              onChange={handleAddFormChange(options)}
              onKeyDown={handleAddFormFocus(options)}
              aria-label="Enter task description"
              maxLength={150}
              className={
                inputType === 'description-input'
                  ? classes.active
                  : ''
              }
              ref={descriptionRef}
            />
            <ButtonGradient type="submit">
              <span>Add Task</span>
            </ButtonGradient>
          </fieldset>
        </form>
      </div>
    );
  }
);

export default AddTaskForm;
