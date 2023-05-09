import asyncHandler from 'express-async-handler';

import { prisma } from '../prisma.js';
import { UserFields } from '../utils/user.utils.js';

//@desc   Get user profile
//@rout   GET /api/users/profile
//@access Private
export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: { id: req.user.id },
		select: UserFields
	});

	const exerciseTimeCompleted = await prisma.exerciseLog.count({
		where: { userId: req.user.id, isCopmleted: true }
	});

	const workouts = await prisma.workoutLog.count({
		where: { userId: req.user.id, isCopmleted: true }
	});

	const kgs = await prisma.exerciseTime.aggregate({
		where: { exerciseLog: { userId: req.user.id }, isCompleted: true },
		_sum: { weight: true }
	});

	res.json({
		...user,
		statistics: [
			{ label: 'Minutes', value: Math.ceil(exerciseTimeCompleted) || 0 },
			{ label: 'Workouts', value: workouts },
			{ label: 'Kgs', value: kgs._sum.weight || 0 }
		]
	});
});
