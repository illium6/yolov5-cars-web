import express from 'express';
import * as path from 'path';
import { rootPath } from '../../utils/paths.js';
import { spawn } from 'node:child_process';
import * as os from 'os';
import { OutputType, PyParamsBuilder } from '../../utils/py-params-builder.js';

interface IPyParamsConfig {
	input: string;
	output: string;
	outputType: OutputType;
	classes: string;
	weights?: string;
}

export const videoUploadRouter = express.Router();

videoUploadRouter.post('/process-user-video', async (req, res) => {
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

	const params = getPythonParams({
		input: videoInputPath,
		output: path.join(rootPath, 'uploads', 'output', req.session.id),
		outputType: req.body.outputType,
		classes: req.body.classes,
		weights: path.join('..', 'neural-network-backbone', 'weights', 'best.pt'),
	});

	const proc = spawn(command, params);

	proc.stderr.on('data', (data) => {
		console.error(data.toString('utf-8'));
	});

	proc.on('exit', (code) => {
		if (code === 0) {
			res.status(200).json({ success: true, message: 'Processed successfully' });
			return;
		}

		res.status(500).json({ success: false, message: code });
	});

	proc.stdout.on('data', (data) => {
		console.log(data.toString('utf-8'));
	});

	req.socket.on('close', () => proc.kill('SIGKILL'));
});

function getPythonParams(config: IPyParamsConfig): string[] {
	const platform = os.platform();

	const mainPyPath =
		platform === 'win32'
			? path.join('..', 'neural-network-backbone', 'main.py')
			: path.join('dist', 'backend', 'neural-network-backbone', 'main.py');

	const builder = new PyParamsBuilder();

	builder.execFilePath(mainPyPath);
	builder.input(config.input);
	builder.output(config.output);
	builder.outputType(config.outputType);
	builder.classes(config.classes);

	if (platform === 'win32' && config.weights) {
		builder.weightsPath(config.weights);
	}

	return builder.build();
}
