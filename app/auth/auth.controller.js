import { faker } from '@faker-js/faker';
import { hash, verify } from 'argon2';
import asyncHandler from 'express-async-handler';

import { prisma } from '../prisma.js';
import { UserFields } from '../utils/user.utils.js';

import { generateToken } from './generate-token.js';

//@desc Auth user
//@route POST /api/users/login
//@access Public
export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		res.status(401);
		throw new Error('Email is not correct');
	}

	const isValidPassword = await verify(user.password, password);

	if (!isValidPassword) {
		res.status(401);
		throw new Error('Password is not correct');
	}

	const token = generateToken(user.id);
	res.json({ user, token });
});

//@desc Register user
//@route POST /api/users/register
//@access Public
export const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const isHaveUser = await prisma.user.findUnique({
		where: { email }
	});

	if (isHaveUser) {
		res.status(400);
		throw new Error('User already exists');
	}

	const user = await prisma.user.create({
		data: {
			email,
			password: await hash(password),
			name: faker.name.fullName()
		},
		select: UserFields
	});

	const token = generateToken(user.id);

	res.json({ user, token });
});
