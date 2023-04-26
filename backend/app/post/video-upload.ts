import express from 'express';
import * as path from 'path';
import { rootPath } from '../../utils/paths.js';

export const videoUploadRouter = express.Router();

videoUploadRouter.post('/upload-user-video', async (req, res) => {
	if (!req.files) {
		res.status(400).json({ success: false, message: 'No file to upload' });
		return;
	}

	const userVideoUpload = req.files['user_video'];
	const video = Array.isArray(userVideoUpload) ? userVideoUpload[0] : userVideoUpload;

	await video.mv(path.join(rootPath, 'uploads', 'input', req.session.id, video.name));

	res.status(200).json({ success: true });
});
