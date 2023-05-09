import express from 'express';
import * as path from 'path';
import { rootPath } from '../../utils/paths.js';
import { spawn } from 'node:child_process';
import * as os from 'os';

export const videoUploadRouter = express.Router();

videoUploadRouter.post('/upload-user-video', async (req, res) => {
	if (!req.files) {
		res.status(400).json({ success: false, message: 'No file to upload' });
		return;
	}

	const userVideoUpload = req.files['user_video'];
	const video = Array.isArray(userVideoUpload) ? userVideoUpload[0] : userVideoUpload;

	const videoInputPath = path.join(rootPath, 'uploads', 'input', req.session.id, video.name);

	await video.mv(videoInputPath);

	const platform = os.platform();
	const command = platform === 'win32' ? 'python' : 'python3';
	const mainPyPath =
		platform === 'win32'
			? path.join('..', 'neural-network-backbone', 'main.py')
			: path.join('dist', 'backend', 'neural-network-backbone', 'main.py');

	const proc = spawn(command, [
		mainPyPath,
		'--input',
		videoInputPath,
		'--output',
		path.join(rootPath, 'uploads', 'output', req.session.id),
		'--output-type',
		req.body.outputType,
		'--filter-classes',
		req.body.classes,
	]);

	proc.stderr.on('data', (data) => {
		console.error(data.toString('utf-8'));
	});

	proc.on('exit', (code) => {
		if (code === 0) {
			res.status(200).json({ success: true, message: 'BIG DICK OOF' });
			return;
		}

		res.status(500).json({ success: false, message: code });
	});

	proc.stdout.on('data', (data) => {
		console.log(data.toString('utf-8'));
	});

	// res.status(200).json({ success: true });
});
