/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { schema } from "./schema";
import { createFourSquare } from "./utilities";
import { AppComponent } from "./components";
import { Logger } from "./logger";
import { DISPLAY_METRICS } from "./globals";
import { initTree } from "./useTree";

async function main() {
	// Inject element into document that will host the React component tree
	const rootElement = document.createElement("div");
	rootElement.id = "root";
	document.body.appendChild(rootElement);

	// Initialize the SharedTree
	const treeRoot = initTree(schema, {
		"": createFourSquare(),
	});

	// Display metrics if enabled
	let logger: Logger<"clickSquare" | "renderSquare"> | undefined;
	if (DISPLAY_METRICS) {
		const counterElement = document.createElement("div");
		counterElement.id = "counter";
		counterElement.innerText = "0";
		counterElement.className = "metrics";
		document.body.appendChild(counterElement);
		logger = new Logger();
		let lastRenderCount = 0;
		let totalRenderCount = 0;
		logger.listen((event) => {
			if (event === "clickSquare") {
				lastRenderCount = 0;
			}
			if (event === "renderSquare") {
				counterElement.innerHTML = `${++lastRenderCount} square components rendered after last click (${++totalRenderCount} total renders this session)`;
			}
		});
	}

	// Render the root React component, which will consume `treeRoot` with `useTree`
	createRoot(rootElement).render(<AppComponent treeRoot={treeRoot} logger={logger} />);
}

export default main();
