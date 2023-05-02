import express, { Request } from 'express';
import * as dotenv from 'dotenv';
import session from 'express-session';
import * as process from 'process';
import { v5 as uuidv5 } from 'uuid';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import * as path from 'path';
import { videoUploadRouter } from './post/video-upload.js';
import { rootPath } from '../utils/paths.js';
import { createDeletionJob } from '../utils/cron-tasks.js';
import { videoDownloadRouter } from './get/download-file.js';
import { outputConfigurationRouter } from './post/output-configuration.js';

createDeletionJob();

if (process.env['NODE_ENV'] !== 'production') {
	dotenv.config();
}

dotenv.config();

const app = express();
const port = 3000;

app.use(
	session({
		secret: process.env['SESSION_SECRET']!,
		cookie: { maxAge: 1000 * 60 ** 2 * 24, sameSite: 'none' },
		resave: false,
		saveUninitialized: true,
		genid(req: Request): string {
			return uuidv5(req.ip, process.env['UUID_NAMESPACE']!);
		},
	}),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	fileUpload({
		createParentPath: true,
	}),
);
app.use(express.static(path.join(rootPath, 'uploads')));

app.use('/api/v1', videoUploadRouter);
app.use('/api/v1', videoDownloadRouter);
app.use('/api/v1', outputConfigurationRouter);
app.use((req, res) => {
	if (!res.headersSent) {
		setTimeout(() => {
			res.status(500).json({ success: false, message: 'Timeout error' });
		}, 25000);
	}
});

app.listen(port, () => {
	return console.log(`Backend is listening at http://localhost:${port}`);
});
