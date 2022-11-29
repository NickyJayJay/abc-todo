import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TableForm from '../../../TableForm';

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
	showMenu: true,
};

describe('context menu', () => {
	test('"In Process" updates properly when clicked', async () => {
		const user = userEvent.setup();
		const handleEditTaskMock = jest.fn();

		render(
			<TableForm
				tasks={mockTasks}
				editTask={mockEditTask}
				handleEditTask={handleEditTaskMock}
				handleFormSubmit={jest.fn((e) => e.preventDefault())}
			/>
		);
		// check if context menu is hidden initially
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();

		// click on status cell to trigger context menu
		const statusButtons = await screen.findAllByRole('button', {
			name: /status/i,
		});
		const statusButton = statusButtons[0];
		fireEvent.click(statusButton);

		// check if context menu is displaying
		expect(handleEditTaskMock).toHaveBeenCalled();

		// click on "In Process" option
		// check if status cell state updates to "In Process"
		// check if status cell is populated with dot image
	});

	// click on "Completed" option
	// check if status cell state updates to "Completed"
	// check if status cell is populated with checkmark image
	// check if row background color is updated to green
	// check if row is prepended to the completed list
	// click on "Forwarded" option
	// check if status cell state updates to "Forwarded"
	// check if status cell is populated with right-pointing arrow image
	// click on "Delegated" option
	// check if status cell state updates to "Delegated"
	// check if status cell is populated with circled checkmark image
	// click on "Remove" option
	// check if row has been removed from the document
	// click on "Cancel" option
	// check if context menu is hidden
});
