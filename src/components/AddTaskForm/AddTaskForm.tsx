import { forwardRef, useRef, useEffect, useContext, ChangeEvent } from 'react';
import { nanoid } from 'nanoid';
import { MainContext } from '../../context/main-context';
import ButtonGradient from '../UI/Button/ButtonGradient';
import classes from '../App/App.module.scss';
import { TaskActionType } from '../../ts/enums';
import Dropdown from '../UI/Dropdown/Dropdown';

const AddTaskForm = forwardRef<HTMLInputElement, {}>(({ }, ref) => {
  const { inputType, taskDispatch, showModal, addFormData, setAddFormData } =
    useContext(MainContext);

  useEffect(() => {
    inputType === 'status-input' && selectRef.current?.focus();
  }, [inputType]);

  const selectRef = useRef<HTMLSelectElement>(null);

  const handlePriorityEvent = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    localStorage.setItem('addTaskPriority', (e.target as HTMLInputElement).value);
    (e as React.MouseEvent).clientX !== 0 &&
      (e as React.MouseEvent).clientY !== 0 &&
      showModal &&
      showModal();
  };

  const handleAddFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.removeItem('addTaskPriority');

    taskDispatch &&
      taskDispatch({
        type: TaskActionType.ADD,
        payload: {
          id: nanoid(),
          status: addFormData!.status,
          priority: addFormData!.priority,
          description: addFormData!.description,
        },
      });

    setAddFormData &&
      setAddFormData({
        status: 'Select Status',
        letterPriority: '',
        numberPriority: '',
        priority: '',
        description: '',
      });
  };

  const handleAddFormKeydown = (e: React.KeyboardEvent | ChangeEvent) => {
    (e as React.KeyboardEvent).key === 'Enter' && e.preventDefault();

    const focusableElements = document.querySelectorAll(
      'a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
    );
    const i = Array.from(focusableElements).indexOf(e.target as HTMLElement);
    const nextFocusableEl = focusableElements[i + 1];
    const prevFocusableEl = focusableElements[i - 1];

    if (!nextFocusableEl || !prevFocusableEl) return;

    if (
      inputType === 'priority-input' &&
      (e as React.KeyboardEvent).key !== 'Tab' &&
      !(e as React.KeyboardEvent).shiftKey
    ) {
      e.preventDefault();
      showModal && showModal();
    } else if (
      ((inputType === 'priority-input' || inputType === 'status-input') &&
        (e as React.KeyboardEvent).key) === 'Tab' &&
      !(e as React.KeyboardEvent).shiftKey
    ) {
      e.preventDefault();
      (nextFocusableEl as HTMLElement).click();
      (nextFocusableEl as HTMLElement).focus();
    } else if ((e as React.KeyboardEvent).key === 'Tab' && (e as React.KeyboardEvent).shiftKey) {
      e.preventDefault();
      (prevFocusableEl as HTMLElement).click();
    }
  };

  const handleAddFormChange = (e: ChangeEvent<Element> | React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fieldName = (e.target as HTMLInputElement).getAttribute('name');
    if (!fieldName) return;
    const fieldValue = (e.target as HTMLInputElement).value;

    const newFormData = { ...addFormData };
    newFormData[fieldName as keyof typeof newFormData] = fieldValue;

    setAddFormData && setAddFormData(newFormData);

  };

  const options = [
    { value: 'In Process', label: 'In Process' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Forwarded', label: 'Forwarded' },
    { value: 'Delegated', label: 'Delegated' },
  ];

  return (
    <div className={classes.addTask}>
      <form onSubmit={handleAddFormSubmit}>
        <fieldset>
          <legend>Add a Task</legend>
          {/* <select
            onChange={handleDropdownChange}
            onKeyDown={handleAddFormKeydown}
            name='status'
            value={addFormData.status as string}
            data-id='status-input'
            aria-label='Select status'
            ref={selectRef}
          >
            <option hidden>Select Status</option>
            <option disabled defaultValue=''>
              Select Status
            </option>
            <option value='In Process'>In Process</option>
            <option value='Completed'>Completed</option>
            <option value='Forwarded'>Forwarded</option>
            <option value='Delegated'>Delegated</option>
          </select> */}
          <Dropdown
            options={options}
            defaultOption={options[0]}
            onChange={(e, selected) => {
              const fieldName = (e.target as HTMLSpanElement).getAttribute('name');
              if (!fieldName) return;
              const optionValue = selected.value;

              const newFormData = { ...addFormData };
              newFormData[fieldName as keyof typeof newFormData] = optionValue;

              setAddFormData && setAddFormData(newFormData);
              console.log(fieldName);
              console.log('Selected:', selected)
            }}
            placeholder="Select Status"
          />
          <input
            type='text'
            name='priority'
            data-id='priority-input'
            placeholder='ABC'
            value={addFormData.priority as string}
            onChange={handleAddFormKeydown}
            onKeyDown={handleAddFormKeydown}
            onTouchEnd={handlePriorityEvent}
            onClick={handlePriorityEvent}
            aria-label='Enter task priority'
            ref={ref}
            className={inputType === 'priority-input' ? classes.active : ''}
          ></input>
          <input
            type='text'
            name='description'
            data-id='description-input'
            placeholder='Enter task description...'
            value={addFormData.description as string}
            onChange={handleAddFormChange}
            onKeyDown={handleAddFormKeydown}
            aria-label='Enter task description'
            maxLength={150}
            className={inputType === 'description-input' ? classes.active : ''}
          />
          <ButtonGradient type='submit'>
            <span>Add Task</span>
          </ButtonGradient>
        </fieldset>
      </form>
    </div>
  );
});

export default AddTaskForm;
