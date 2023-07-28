/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { typeNameSymbol } from "@fluid-experimental/tree2";
import { Logger } from "./logger";

export function createFourSquare() {
	return {
		[typeNameSymbol]: "fourSquare",
		topLeft: {
			"": {
				[typeNameSymbol]: "color",
				red: 239,
				green: 71,
				blue: 30,
			},
		},
		topRight: {
			"": {
				[typeNameSymbol]: "color",
				red: 126,
				green: 194,
				blue: 64,
			},
		},
		bottomLeft: {
			"": {
				[typeNameSymbol]: "color",
				red: 0,
				green: 169,
				blue: 225,
			},
		},
		bottomRight: {
			"": {
				[typeNameSymbol]: "color",
				red: 247,
				green: 187,
				blue: 14,
			},
		},
	} as const;
}

export type AppLogger = Logger<"clickSquare" | "renderSquare">;
