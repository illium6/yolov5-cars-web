import { ChangeDetectionStrategy, Component, Renderer2 } from '@angular/core';
import { VideoUploadService } from '../../services/video-upload.service';
import { first, Observable } from 'rxjs';
import { UnsafeValue } from '../../interfaces/unsafe-value';

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [VideoUploadService],
})
export class FileUploadComponent {
	public loading$: Observable<boolean> = this.uploadService.loading$;

	public constructor(
		private render: Renderer2,
		private uploadService: VideoUploadService
	) {}

	public onDragOver(event: Event): void {
		event.preventDefault();
		this.render.addClass(event.target, 'highlight');
	}

	public onDragLeave(event: Event): void {
		event.preventDefault();
		this.render.removeClass(event.target, 'highlight');
	}

	public onDrop(event: DragEvent | Event): void {
		event.preventDefault();
		this.onDragLeave(event);

		let files: UnsafeValue<FileList>;

		if (event instanceof DragEvent) {
			files = event.dataTransfer?.files;
		}

		if (event instanceof Event) {
			files = (event.target as HTMLInputElement)?.files;
		}

		if (!files?.length) {
			return;
		}

		if (files.length > 1) {
			alert('Нельзя загружать больше одного файла');
			return;
		}

		this.uploadService.uploadFile(files[0].name).pipe(first()).subscribe();
	}
}
