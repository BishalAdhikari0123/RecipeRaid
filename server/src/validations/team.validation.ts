import Joi from 'joi';

export const createTeamSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
});

export const updateTeamSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
});

export const inviteMemberSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});
