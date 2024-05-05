import React from 'react';

import { TaskActionType } from '../../ts/enums';
import { EditFormData, EditTask } from '../../ts/interfaces';
import { Task, TaskActionShape } from '../../ts/types';
import sortList from '../../utilities/sortList';

export interface Options {
  editTask?: EditTask;
  editFormData?: EditFormData;
  task?: Task;
  tasks?: Task[];
  taskDispatch?: React.Dispatch<TaskActionShape>;
  setEditFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
  toggleModal?: () => void;
  setEditTask?: React.Dispatch<React.SetStateAction<EditTask>>;
  setX?: (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => string | null;
  setY?: (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => string | null;
}

export const handleFormSubmit = (e: React.FormEvent, options: Options = {} as Options) => {
  const { editTask, editFormData, tasks, taskDispatch }: Options = options;

  e.preventDefault();

  const editedTask: Task = {
    id: editTask!.rowId,
    status: editFormData!.status,
    priority: editFormData!.priority,
    description: editFormData!.description,
  };

  const newTasks = [...tasks!];
  const index = tasks!.findIndex((task) => task.id === editTask!.rowId);
  newTasks[index] = editedTask;

  taskDispatch!({
    type: TaskActionType.SET,
    data: newTasks,
  });

  sortList(newTasks);
  localStorage.setItem('tasks', JSON.stringify(newTasks));
};

export const handleEditFormKeyboard = (
  e: React.KeyboardEvent,
  options: Options = {} as Options
) => {
  const { editTask, editFormData, tasks, taskDispatch, setEditFormData }: Options = options;

  const form = (e.target as HTMLInputElement).form;
  const focusableElements = document.querySelectorAll(
    'a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
  );
  const i = Array.from(form!.elements).indexOf(e.target as HTMLButtonElement);
  const j = Array.from(focusableElements).indexOf(e.target as HTMLElement);
  const curFocusableEl = form!.elements[i] || focusableElements[j];
  const nextFocusableEl = form!.elements[i + 1] || focusableElements[j + 1];
  const prevFocusableEl = form!.elements[i - 1] || focusableElements[j - 1];

  if (!nextFocusableEl || !prevFocusableEl) return;

  if (
    curFocusableEl.getAttribute('name') === 'description' &&
    (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey))
  ) {
    e.preventDefault();
    handleFormSubmit(e, {
      editTask,
      editFormData,
      tasks,
      taskDispatch,
    });
    (nextFocusableEl as HTMLElement).click();
  } else if (
    e.key === 'Tab' &&
    e.shiftKey &&
    ((curFocusableEl as HTMLElement).dataset.id === 'priority-cell' ||
      curFocusableEl.getAttribute('name') === 'description')
  ) {
    e.preventDefault();
    (prevFocusableEl as HTMLElement).click();
  }

  const fieldName = (e.target as Element).getAttribute('name');
  const fieldValue =
    fieldName === 'priority'
      ? (e.target as HTMLInputElement | HTMLSelectElement).value.toUpperCase()
      : (e.target as HTMLInputElement | HTMLSelectElement).value;

  const newFormData = { ...editFormData };
  newFormData[fieldName as keyof typeof newFormData] = fieldValue;

  setEditFormData!(newFormData);
};

export const handleEditTask = (
  e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
  options: Options = {} as Options
) => {
  const { toggleModal, setEditTask, task, setX, setY, setEditFormData }: Options = options;

  let statusCell = (e.target as HTMLElement).dataset.id === 'status-cell',
    priorityCell = (e.target as HTMLElement).dataset.id === 'priority-cell';

  if (
    ((e as React.KeyboardEvent).key === 'Tab' ||
      (e as React.KeyboardEvent).key === 'Escape' ||
      (e as React.KeyboardEvent).shiftKey) &&
    statusCell
  )
    return;

  e.preventDefault();

  if (
    ((e as React.KeyboardEvent).key === 'Enter' ||
      ((e as React.MouseEvent).type === 'click' &&
        (e as React.MouseEvent).clientX !== 0 &&
        (e as React.MouseEvent).clientY !== 0)) &&
    task!.status !== 'Completed' &&
    task!.status !== 'Forwarded' &&
    priorityCell
  ) {
    toggleModal!();
  }

  e.stopPropagation();
  statusCell && e.preventDefault();
  statusCell && (e.target as HTMLElement).tagName === 'IMG'
    ? (e.target as HTMLElement).parentElement?.focus()
    : (e.target as HTMLElement).focus();
  setEditTask!({
    rowId: task!.id || null,
    inputType: (e.target as HTMLElement).dataset.id,
    xPos: setX && setX(e),
    yPos: setY && setY(e),
    showMenu:
      ((e as React.MouseEvent).pageX && (e as React.MouseEvent).pageY && statusCell) ||
      ((e as React.KeyboardEvent).key === 'Enter' && statusCell)
        ? true
        : false,
  });
  const formValues: EditFormData = {
    status: task!.status || null,
    letterPriority: '',
    numberPriority: '',
    priority: task!.priority,
    description: task!.description,
  };

  setEditFormData!(formValues);
};
