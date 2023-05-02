import express from 'express';

export const outputConfigurationRouter = express.Router();

outputConfigurationRouter.post('/output-configuration', (req, res) => {
	res.status(200).json(req.body);
});
