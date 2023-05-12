import * as cron from 'node-cron';
import * as fs from 'fs';
import { rootPath } from './paths.js';
import * as path from 'path';

const oneDay = 1000 * 60 * 60 * 24;

export function createDeletionJob(): void {
	const uploadsDir = path.join(rootPath, 'uploads');
	const inputDir = path.join(uploadsDir, 'input');
	const outputDir = path.join(uploadsDir, 'output');

	cron.schedule('* */1 * * *', () => {
		[inputDir, outputDir].forEach((dir) => {
			fs.readdir(dir, (err, files) => {
				if (err) {
					console.error(err);
					return;
				}

				files.forEach((file: string) => {
					const fileName = path.join(dir, file);
					fs.stat(fileName, (err, stats) => {
						if (err) {
							console.error(err);
							return;
						}

						const now = new Date().getTime();
						const fileCreated = new Date(stats.ctime).getTime() + oneDay;

						if (now >= fileCreated) {
							deleteDir(fileName);
						}
					});
				});
			});
		});
	});
}

function deleteDir(dirName: string): void {
	fs.rm(dirName, { recursive: true, force: true }, (err) => {
		if (err) {
			console.error(err);
			return;
		}
	});
}
