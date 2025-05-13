import { rest } from 'msw';

export const handlers = [
	rest.get(
		`https://benny-32eaa-default-rtdb.firebaseio.com/tasks.json`,
		(req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([
					{
						description: 'Planning and solitude',
						id: '1',
						priority: 'A1',
						status: 'In Process',
					},
					{
						description: 'Mow the lawn',
						id: '2',
						priority: 'B1',
						status: 'Completed',
					},
					{
						description: 'Do taxes',
						id: '3',
						priority: 'A2',
						status: 'Delegated',
					},
					{
						description: 'Hang out with friends',
						id: '4',
						priority: 'C1',
						status: 'Forwarded',
					},
				])
			);
		}
	),
	rest.post(
		`https://benny-32eaa-default-rtdb.firebaseio.com/tasks.json`,
		(req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([
					{
						status: 'Completed',
						priority: 'B1',
						description: 'mow the lawn',
					},
				])
			);
		}
	),
];
