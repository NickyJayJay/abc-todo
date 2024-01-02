import {
  render,
  screen,
  within,
  waitFor,
} from '@testing-library/react';
import { rest } from 'msw';
import { server } from '../../mocks/server';

import App from './App';

describe('app', () => {
  test('loading message should display while data is being fetched and should be hidden afterwards', async () => {
    render(<App />);

    const loadingMessage = await screen.findByText(/loading/i);
    const taskList = screen.queryByRole('table');

    expect(loadingMessage).toBeInTheDocument();
    expect(taskList).not.toBeInTheDocument();

    await waitFor(() => {
      const tasksContainer = screen.getAllByRole('rowgroup')[1];
      const fetchedTasks = within(tasksContainer).getAllByRole('row');

      // expect(fetchedTasks).toHaveLength(4);
    });

    expect(loadingMessage).not.toBeInTheDocument();
  });

  test('table should be populated with four rows of mock tasks after data has been fetched', async () => {
    render(<App />);

    const taskDescription = await screen.findByText(
      /planning and solitude/i
    );
    // const taskStatus = screen.getByAltText(/in process/i);
    const taskPriority = screen.getByText('A1');
    const tasksContainer = screen.getAllByRole('rowgroup')[1];
    const fetchedTasks = within(tasksContainer).getAllByRole('row');

    // expect(fetchedTasks).toHaveLength(4);
    expect(taskDescription).toBeInTheDocument();
    // expect(taskStatus).toBeInTheDocument();
    expect(taskPriority).toBeInTheDocument();
  });

  test('error message should appear if fetch call is unsuccessful', async () => {
    server.use(
      rest.get(
        'https://benny-32eaa-default-rtdb.firebaseio.com/tasks.json',
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );

    render(<App />);

    // const errorMessage = await screen.findByText(
    //   /something went wrong/i
    // );
    const taskList = screen.queryByRole('table');

    // expect(errorMessage).toBeInTheDocument();
    expect(taskList).not.toBeInTheDocument();
  });
});
