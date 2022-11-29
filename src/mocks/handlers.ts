import { rest } from 'msw';

export const handlers = [
	rest.get(
		`https://benny-32eaa-default-rtdb.firebaseio.com/tasks.json`,
		(req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([
					{
						description: 'planning and solitude',
						id: '1',
						priority: 'A1',
						status: 'In Process',
					},
					{
						description: 'planning and solitude',
						id: '2',
						priority: 'B2',
						status: 'Completed',
					},
					{
						description: 'planning and solitude',
						id: '3',
						priority: 'C3',
						status: 'Forwarded',
					},
					{
						description: 'planning and solitude',
						id: '4',
						priority: 'A2',
						status: 'Delegated',
					},
				])
			);
		}
	),
];
