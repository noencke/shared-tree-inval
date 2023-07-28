/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export class Logger<E extends string = string> {
	private readonly listeners: ((event: E) => void)[] = [];

	public listen(listener: (event: E) => void): void {
		this.listeners.push(listener);
	}

	public log(event: E): void {
		this.listeners.forEach((l) => l(event));
	}
}
