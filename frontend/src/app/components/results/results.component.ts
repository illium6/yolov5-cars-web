import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PredictionsConnector } from '../../api/connectors/predictions-connector';
import { VideoConnector } from '../../api/connectors/video-connector';
import { catchError, combineLatest, first, map, Observable, of, startWith, switchMap } from 'rxjs';
import * as fileSaver from 'file-saver';
import { environment } from '../../../environments/environment';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { ResultsModel } from '../../models/results-model';

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent implements OnInit {
	public videoSrc = `${environment.apiUrl}/get-output-video`;

	public predictions$: Observable<string> = this.predictionConnector
		.downloadPredictions()
		.pipe(switchMap((blob) => fromPromise(blob.text())));

	public resultsModel$!: Observable<ResultsModel>;

	public constructor(
		private predictionConnector: PredictionsConnector,
		private videoConnector: VideoConnector,
	) {}

	public ngOnInit() {
		const _predictions$ = this.predictionConnector.downloadPredictions().pipe(
			map(() => true),
			catchError(() => of(false)),
		);
		const _video$ = this.videoConnector.downloadProcessedVideo().pipe(
			map(() => true),
			catchError(() => of(false)),
		);
		this.resultsModel$ = combineLatest([_predictions$, _video$]).pipe(
			map(([hasPreds, hasVideo]: boolean[]) => {
				if (hasPreds || hasVideo) {
					return ResultsModel.createReady({
						hasVideo,
						hasPredictions: hasPreds,
					});
				}

				return ResultsModel.createError();
			}),
			startWith(ResultsModel.createPending()),
		);
	}

	public downloadPredictions(): void {
		this.predictionConnector
			.downloadPredictions()
			.pipe(first())
			.subscribe((predBlob: Blob) => {
				const formattedBlob = new Blob([predBlob], { type: 'text/json; charset=utf-8' });
				fileSaver.saveAs(formattedBlob, 'predictions.json');
			});
	}

	public downloadVideo(): void {
		this.videoConnector
			.downloadProcessedVideo()
			.pipe(first())
			.subscribe((videoBlob) => {
				const formattedBlob = new Blob([videoBlob], { type: 'video/webm' });
				fileSaver.saveAs(formattedBlob, 'output.webm');
			});
	}
}
