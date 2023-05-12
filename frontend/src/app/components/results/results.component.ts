import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PredictionsConnector } from '../../api/connectors/predictions-connector';
import { VideoConnector } from '../../api/connectors/video-connector';
import { first } from 'rxjs';
import * as fileSaver from 'file-saver';

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent {
	public constructor(
		private predictionConnector: PredictionsConnector,
		private videoConnector: VideoConnector,
	) {}

	public downloadPredictions(): void {
		this.predictionConnector
			.downloadPredictions()
			.pipe(first())
			.subscribe((predBlob: Blob) => {
				const formattedBlob = new Blob([predBlob], { type: 'text/json; charset=utf-8' });
				fileSaver.saveAs(formattedBlob, 'predictions.json');
			});
	}
}
