import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { rootPath } from '../../utils/paths.js';

export const videoDownloadRouter = express.Router();

videoDownloadRouter.get('/get-output-video', (req, res) => {
	const videoPath = path.join(rootPath, 'uploads', 'output', req.session.id, 'output.webm');

	fs.stat(videoPath, (err, stat) => {
		if (err?.code === 'ENOENT') {
			res.status(400).json({ success: false, message: 'No file to download' });
			return;
		}

		if (err == null) {
			res.download(videoPath);
			return;
		}

		res.status(500).json({ success: false, message: 'Unknown error' });
	});
});

videoDownloadRouter.get('/get-predictions', (req, res) => {
	const predictionsPath = path.join(
		rootPath,
		'uploads',
		'output',
		req.session.id,
		'predictions.json',
	);

	fs.stat(predictionsPath, (err, stat) => {
		if (err?.code === 'ENOENT') {
			res.status(400).json({ success: false, message: 'No file to download' });
			return;
		}

		if (err == null) {
			res.download(predictionsPath);
			return;
		}

		res.status(500).json({ success: false, message: 'Unknown error' });
	});
});
