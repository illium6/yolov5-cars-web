export enum ModelState {
	READY = 'ready',
	PENDING = 'pending',
	ERROR = 'error',
}

export interface ResultsData {
	hasVideo: boolean;
	hasPredictions: boolean;
}

export class ResultsModel {
	public get pending(): boolean {
		return this.state === ModelState.PENDING;
	}

	public get ready(): boolean {
		return this.state === ModelState.READY;
	}

	public get error(): boolean {
		return this.state === ModelState.ERROR;
	}

	public constructor(private state: ModelState, public item?: ResultsData) {}

	public static createPending(): ResultsModel {
		return new ResultsModel(ModelState.PENDING);
	}

	public static createReady(data: ResultsData): ResultsModel {
		return new ResultsModel(ModelState.READY, data);
	}

	public static createError(): ResultsModel {
		return new ResultsModel(ModelState.ERROR);
	}
}
