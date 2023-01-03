import { render, screen, fireEvent } from '@testing-library/react';

import App from '../../../App';

describe('Modal', () => {
	test('Modal hidden if isModal state is false and element being edited is not a priority cell in the table or the priority input in the AddTaskForm', async () => {
		render(<App />);

		const priorityInput = await screen.findByLabelText(/enter task priority/i);
		expect(priorityInput).toBeInTheDocument();
		fireEvent.click(priorityInput);
	});
	test('Modal displays if isModal state is true and element being edited is a priority cell in the table or the priority input in the AddTaskForm', () => {});
	test('Modal displays if user clicks on a priority cell in the table or the priority input in the AddTaskForm', () => {});
	test('Modal is hidden if user clicks the close button ("X" in the upper right corner) or the semi-opaque backdrop', () => {});
});
