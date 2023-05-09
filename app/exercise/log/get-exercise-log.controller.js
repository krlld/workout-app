import asyncHandler from 'express-async-handler';

import { prisma } from '../../prisma.js';

import { addPrevValues } from './add-prev-values.utils.js';

//@desc   Get exerciseLog
//@rout   GET /api/exercises/log/:id
//@access Private
export const getExerciseLog = asyncHandler(async (req, res) => {
	const exerciseLog = await prisma.exerciseLog.findUnique({
		where: { id: +req.params.id },
		include: { exercise: true, times: { orderBy: { id: 'asc' } } }
	});

	if (!exerciseLog) {
		res.status(404);
		throw new Error('Exercise Log not found!');
	}

	const prevExerciseLog = await prisma.exerciseLog.findFirst({
		where: {
			exerciseId: exerciseLog.exerciseId,
			userId: req.user.id,
			isCopmleted: true
		},
		orderBy: { createdAt: 'desc' },
		include: { times: true }
	});

	let newTimes = addPrevValues(exerciseLog, prevExerciseLog);

	res.json({ ...exerciseLog, times: newTimes });
});
