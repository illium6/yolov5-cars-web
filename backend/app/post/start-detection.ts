import express from 'express';

export const startDetectionRouter = express.Router();

startDetectionRouter.post('/start-detection', (req, res) => {
	res.status(200).json(req.body);
});
