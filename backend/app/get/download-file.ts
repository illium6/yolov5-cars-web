import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { rootPath } from '../../utils/paths.js';

export const videoDownloadRouter = express.Router();

videoDownloadRouter.get('/result-video', async (req, res) => {
	const uploadDir: string = path.join(rootPath, 'uploads', 'output', req.session.id);

	fs.access(uploadDir, (err) => {
		if (err) {
			console.error(err);

			res.status(500).json({ success: false, message: 'No file to download' });
		}

		fs.readdir(uploadDir, (err, files) => {
			if (err) {
				console.error(err);

				res.status(500).json({ success: false, message: 'No file to download' });
			}

			files.forEach((file: string) => {
				if (file.startsWith('output.video.')) {
					res.download(path.join(uploadDir, file));
				}
			});
		});
	});
});
