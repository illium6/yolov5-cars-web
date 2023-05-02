import { ChangeDetectionStrategy, Component, Input, Renderer2 } from '@angular/core';
import { UnsafeValue } from '../../interfaces/unsafe-value';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
	@Input()
	public form!: FormControl;

	public constructor(private render: Renderer2) {}

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

		this.form.setValue(files[0]);
	}
}
