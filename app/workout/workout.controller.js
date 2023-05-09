import asyncHandler from 'express-async-handler';

import { prisma } from '../prisma.js';

//@desc   Create new workout
//@rout   POST /api/workouts
//@access Private
export const createNewWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body;

	const workout = await prisma.workout.create({
		data: {
			name,
			exercises: {
				connect: exerciseIds.map(id => ({
					id: +id
				}))
			}
		}
	});

	res.json(workout);
});

//@desc   Get workouts
//@rout   GET /api/workouts
//@access Private
export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		orderBy: { createdAt: 'desc' },
		include: { exercises: true }
	});

	res.json(workouts);
});

//@desc   Get workout
//@rout   GET /api/workouts/:id
//@access Private
export const getWorkout = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: { id: +req.params.id },
		include: { exercises: true }
	});

	if (!workout) {
		res.status(404);
		throw new Error('Workout not found!');
	}

	const minutes = calculateMinute(workout.exercises.length);

	res.json({ workout, minutes });
});

//@desc   Update workout
//@rout   PUT /api/workouts/:id
//@access Private
export const updateWorkout = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: { id: +req.params.id }
	});

	if (!workout) {
		res.status(404);
		throw new Error('Workout not found!');
	}

	const { name, exerciseIds } = req.body;

	const updateWorkout = await prisma.workout.update({
		where: { id: +req.params.id },
		data: { name, exercises: { set: exerciseIds.map(id => ({ id: +id })) } }
	});

	res.json(updateWorkout);
});

//@desc   Delete workout
//@rout   DELETE /api/workouts/:id
//@access Private
export const deleteWorkout = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: { id: +req.params.id }
	});

	if (!workout) {
		res.status(404);
		throw new Error('Workout not found!');
	}

	const deleteWorkout = await prisma.workout.delete({
		where: { id: +req.params.id }
	});

	res.json(deleteWorkout);
});
