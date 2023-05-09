import express from 'express';

import { protect } from '../middleware/auth.middleware.js';

import {
	createNewExercise,
	getExercises,
	updateExercise,
	deleteExercise
} from './exercise.controller.js';
import { createNewExerciseLog } from './log/exercise-log.controller.js';
import { getExerciseLog } from './log/get-exercise-log.controller.js';
import {
	updateCompleteExerciseLog,
	updateExerciseLogTime
} from './log/update-exercise-log.controller.js';

const router = express.Router();

router.route('/').post(protect, createNewExercise);
router.route('/').get(protect, getExercises);
router.route('/:id').put(protect, updateExercise);
router.route('/:id').delete(protect, deleteExercise);

router.route('/log/:exerciseId').post(protect, createNewExerciseLog);
router.route('/log/:id').get(protect, getExerciseLog);

router.route('/log/time/:id').put(protect, updateExerciseLogTime);
router.route('/log/complete/:id').patch(protect, updateCompleteExerciseLog);

export default router;
