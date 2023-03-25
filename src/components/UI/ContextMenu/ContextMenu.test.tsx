import { render, screen, fireEvent, within } from '@testing-library/react';
import { ref } from 'firebase/database';

import { db } from '../../../firebaseConfig';
import TableForm from '../../TableForm/TableForm';
import ContextMenu from './ContextMenu';
import { handleMenuItemEvent } from './handleMenuItemEvent';
import Button from '../Button/Button';

const mockTasks = [
	{
		description: 'test',
		id: '1',
		priority: 'A1',
		status: 'In Process',
	},
	{
		description: 'test',
		id: '2',
		priority: 'B2',
		status: 'Completed',
	},
	{
		description: 'test',
		id: '3',
		priority: 'C3',
		status: 'Forwarded',
	},
	{
		description: 'test',
		id: '4',
		priority: 'A2',
		status: 'Delegated',
	},
];

const mockEditTask = {
	rowId: null,
	inputType: null,
	xPos: '0px',
	yPos: '0px',
	xPosTouch: '0px',
	yPosTouch: '0px',
	showMenu: false,
};

const editFormData = {
	status: 'Completed',
	letterPriority: 'A',
	numberPriority: '1',
	priority: 'A1',
	description: '',
};

const editTask = mockEditTask;
const rowId = null;
const setEditTask = jest.fn();
const setEditFormData = jest.fn();
const sortList = jest.fn();
const tasks = mockTasks;
const taskDispatch = jest.fn();
const update = jest.fn();
const remove = jest.fn();
const handleEditTask = jest.fn();
const setX = jest.fn();
const setY = jest.fn();
const toggleModal = jest.fn();
const handleMenuMockArgs = {
	editTask,
	rowId,
	setEditTask,
	editFormData,
	setEditFormData,
	sortList,
	tasks,
	taskDispatch,
	ref,
	db,
	update,
	remove,
};

describe('context menu', () => {
	test('menu hidden if showMenu state is false and displays if showMenu is true; event handler (handleEditTask) called when status cell button is clicked', () => {
		render(
			<TableForm
				tasks={mockTasks}
				editTask={mockEditTask}
				rowId={null}
				handleEditTask={handleEditTask}
				handleFormSubmit={jest.fn((e) => e.preventDefault())}
				handleMenuItemEvent={jest.fn()}
				showMenu={false}
				setEditFormData={setEditFormData}
				editFormData={editFormData}
				setX={setX}
				setY={setY}
				toggleModal={toggleModal}
				setEditTask={setEditTask}
			/>
		);

		// check if context menu is hidden when showMenu set to false
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();

		// click on a status cell to trigger handleEditTask
		const statusButtons = screen.getAllByRole('button', {
			name: /status/i,
		});
		const statusButton = statusButtons[0];
		fireEvent.click(statusButton);

		// check if handleEditTask has been called
		expect(handleEditTask).toHaveBeenCalledTimes(1);
		expect(handleEditTask.mock.calls[0][1]).toEqual(
			expect.objectContaining({
				setEditFormData: expect.anything(),
				setEditTask: expect.anything(),
				setX: expect.anything(),
				setY: expect.anything(),
				task: expect.anything(),
				toggleModal: expect.anything(),
			})
		);

		render(
			<TableForm
				tasks={mockTasks}
				editTask={mockEditTask}
				handleEditTask={handleEditTask}
				handleFormSubmit={jest.fn((e) => e.preventDefault())}
				handleMenuItemEvent={jest.fn()}
				showMenu={true}
				setEditFormData={setEditFormData}
				editFormData={editFormData}
				setX={setX}
				setY={setY}
				toggleModal={toggleModal}
				setEditTask={setEditTask}
			/>
		);

		// check if context menu displays when showMenu set to true
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	test('event handler (handleMenuItemEvent) returns a function', () => {
		const func = handleMenuItemEvent(handleMenuMockArgs);

		// check if handleMenuItemEvent returns a function
		expect(typeof func).toEqual('function');
	});

	test('handleMenuItemEvent is called when any menu button is clicked', () => {
		const handleMenuItemEventMock = jest.fn();

		render(
			<ContextMenu
				xPos={null}
				yPos={null}
				editTask={mockEditTask}
				tasks={mockTasks}
				taskDispatch={jest.fn()}
				editFormData={editFormData}
				setEditTask={jest.fn()}
				setEditFormData={jest.fn()}
				handleMenuItemEvent={handleMenuItemEventMock}
			/>
		);

		const menuItems = screen.getAllByRole('menuitem');
		menuItems.forEach((menuItem) => {
			fireEvent.click(within(menuItem).getByRole('button'));
		});

		expect(handleMenuItemEventMock).toHaveBeenCalledTimes(6);
	});

	test('clicking on "In Process", "Forwarded" or "Delegated" updates state, makes a Firebase API update request and triggers a new sorting call', () => {
		render(
			<Button onClick={handleMenuItemEvent(handleMenuMockArgs)}>
				<span>In Process</span>
			</Button>
		);

		// click on "In Process" option
		const inProcessBtn = screen.getByRole('button', {
			name: /in process/i,
		});
		fireEvent.click(inProcessBtn);

		render(
			<Button onClick={handleMenuItemEvent(handleMenuMockArgs)}>
				<span>Forwarded</span>
			</Button>
		);

		// click on "Forwarded" option
		const forwardedBtn = screen.getByRole('button', {
			name: /forwarded/i,
		});
		fireEvent.click(forwardedBtn);

		render(
			<Button onClick={handleMenuItemEvent(handleMenuMockArgs)}>
				<span>Delegated</span>
			</Button>
		);

		// click on "Delegated" option
		const delegatedBtn = screen.getByRole('button', {
			name: /delegated/i,
		});
		fireEvent.click(delegatedBtn);

		expect(setEditFormData).toHaveBeenCalledTimes(0);
		expect(taskDispatch).toHaveBeenCalledTimes(3);
		expect(taskDispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				type: expect.any(Number),
				data: expect.any(Array),
			})
		);
		expect(update).toHaveBeenCalledTimes(3);
		expect(remove).toHaveBeenCalledTimes(0);
		expect(setEditTask).toHaveBeenCalledTimes(3);
		expect(setEditTask).toHaveBeenCalledWith(editTask);
		expect(sortList).toHaveBeenCalledTimes(3);
	});

	test('clicking on "Completed" calls setEditFormData (resets priority) in addition to updating state, making a Firebase API update request and triggering a new sorting call', () => {
		render(
			<Button onClick={handleMenuItemEvent(handleMenuMockArgs)}>
				<span>Completed</span>
			</Button>
		);

		// click on "Completed" option
		const completedBtn = screen.getByRole('button', {
			name: /completed/i,
		});
		fireEvent.click(completedBtn);

		expect(setEditFormData).toHaveBeenCalledTimes(1);
		expect(taskDispatch).toHaveBeenCalledTimes(1);
		expect(taskDispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				type: expect.any(Number),
				data: expect.any(Array),
			})
		);
		expect(update).toHaveBeenCalledTimes(1);
		expect(remove).toHaveBeenCalledTimes(0);
		expect(setEditTask).toHaveBeenCalledTimes(1);
		expect(setEditTask).toHaveBeenCalledWith(editTask);
		expect(sortList).toHaveBeenCalledTimes(1);
	});

	test('clicking on "Remove" makes a Firebase API remove request, updates state and triggers a new sorting call', () => {
		render(
			<Button onClick={handleMenuItemEvent(handleMenuMockArgs)}>
				<span>Remove</span>
			</Button>
		);

		// click on "Remove" option
		const removeBtn = screen.getByRole('button', {
			name: /remove/i,
		});
		fireEvent.click(removeBtn);

		expect(setEditFormData).toHaveBeenCalledTimes(0);
		expect(taskDispatch).toHaveBeenCalledTimes(1);
		expect(taskDispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				type: expect.any(Number),
				index: expect.any(Number),
			})
		);
		expect(update).toHaveBeenCalledTimes(0);
		expect(remove).toHaveBeenCalledTimes(1);
		expect(setEditTask).toHaveBeenCalledTimes(1);
		expect(setEditTask).toHaveBeenCalledWith(editTask);
		expect(sortList).toHaveBeenCalledTimes(0);
	});

	test('clicking on "Cancel" only calls setEditTask (hides the menu)', () => {
		render(
			<Button onClick={handleMenuItemEvent(handleMenuMockArgs)}>
				<span>Cancel</span>
			</Button>
		);

		// click on "Cancel" option
		const cancelBtn = screen.getByRole('button', {
			name: /cancel/i,
		});
		fireEvent.click(cancelBtn);

		expect(setEditFormData).toHaveBeenCalledTimes(0);
		expect(taskDispatch).toHaveBeenCalledTimes(0);
		expect(update).toHaveBeenCalledTimes(0);
		expect(remove).toHaveBeenCalledTimes(0);
		expect(setEditTask).toHaveBeenCalledTimes(1);
		expect(setEditTask).toHaveBeenCalledWith(editTask);
		expect(sortList).toHaveBeenCalledTimes(0);
	});
});
