import Joi from 'joi';

export const startRaidSchema = Joi.object({
  teamId: Joi.string().uuid().required(),
  bossId: Joi.string().uuid().required(),
});

export const completeRaidSchema = Joi.object({
  score: Joi.number().integer().min(0).required(),
  timeTakenMinutes: Joi.number().integer().min(0).required(),
  notes: Joi.string().max(1000).optional(),
});

export const uploadPhotoProofSchema = Joi.object({
  photoUrl: Joi.string().uri().required(),
  storagePath: Joi.string().required(),
});
