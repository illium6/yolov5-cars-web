export type OutputType = 'all' | 'json' | 'video';

export class PyParamsBuilder {
	private mainFile: string | null = null;
	private params: string[] = [];

	public execFilePath(path: string): this {
		this.mainFile = path;
		return this;
	}

	public input(path: string): this {
		this.params.push('--input', path);
		return this;
	}

	public output(path: string): this {
		this.params.push('--output', path);
		return this;
	}

	public outputType(type: OutputType): this {
		this.params.push('--output-type', type);
		return this;
	}

	public classes(classes: string): this {
		this.params.push('--filter-classes', classes);

		return this;
	}

	public weightsPath(path: string): this {
		this.params.push('--weights', path);
		return this;
	}

	public build(): string[] {
		if (this.mainFile == null) {
			throw new Error('Path to main.py not defined');
		}

		this.params.unshift(this.mainFile);
		return this.params;
	}
}
