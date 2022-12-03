import { rest } from 'msw';

export const handlers = [
	rest.get(`/tasks.json`, (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json([
				{
					description: 'planning and solitude',
					id: '1',
					priority: 'A1',
					status: 'In Process',
				},
			])
		);
	}),
	rest.post(`/tasks.json`, (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json([
				{
					status: 'Completed',
					priority: 'A2',
					description: 'mow the lawn',
				},
			])
		);
	}),
];
