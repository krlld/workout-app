import asyncHandler from 'express-async-handler';

import { prisma } from '../prisma.js';

//@desc   Create new exercise
//@rout   POST /api/exercise
//@access Private
export const createNewExercise = asyncHandler(async (req, res) => {
	const { name, times, iconPath } = req.body;

	const exercise = await prisma.exercise.create({
		data: { name, times, iconPath }
	});

	res.json(exercise);
});

//@desc   Get exercises
//@rout   GET /api/exercises
//@access Private
export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany({
		orderBy: { createdAt: 'desc' }
	});

	res.json(exercises);
});

//@desc   Update exercise
//@rout   PUT /api/exercises/:id
//@access Private
export const updateExercise = asyncHandler(async (req, res) => {
	const exercise = await prisma.exercise.findUnique({
		where: { id: +req.params.id }
	});

	if (!exercise) {
		res.status(404);
		throw new Error('Exercise not found!');
	}

	const { name, times, iconPath } = req.body;

	const updateExercise = await prisma.exercise.update({
		where: { id: +req.params.id },
		data: { name, times, iconPath }
	});

	res.json(updateExercise);
});

//@desc   Delete exercise
//@rout   DELETE /api/exercises/:id
//@access Private
export const deleteExercise = asyncHandler(async (req, res) => {
	const exercise = await prisma.exercise.findUnique({
		where: { id: +req.params.id }
	});

	if (!exercise) {
		res.status(404);
		throw new Error('Exercise not found!');
	}

	const deleteExercise = await prisma.exercise.delete({
		where: { id: +req.params.id }
	});

	res.json(deleteExercise);
});
