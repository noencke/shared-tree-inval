/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import "./style.css";
import { Square, isColor } from "../schema";
import { AppLogger, createFourSquare } from "../utilities";
import { MEMOIZE_SQUARES } from "../globals";
import { memoTree } from "../memoTree";

const SquareComponentMemo = MEMOIZE_SQUARES ? memoTree(SquareComponent) : SquareComponent;
export default SquareComponentMemo;

function SquareComponent({ root, logger }: { root: Square; logger?: AppLogger }): JSX.Element {
	logger?.log("renderSquare");
	const content = root[""];
	if (isColor(content)) {
		return (
			<div
				className="square"
				style={{
					backgroundColor: `rgb(${content.red}, ${content.green}, ${content.blue})`,
				}}
				onClick={() => {
					logger?.log("clickSquare");
					// Ideally this cast would not be necessary, but currently the schema aware types used for reading a struct are slightly different than those used for writing.
					(root as { [""]: ReturnType<typeof createFourSquare> })[""] =
						createFourSquare();
				}}
			></div>
		);
	}

	return (
		<div className="fourSquare">
			<div className="topLeftSquare">
				<SquareComponentMemo root={content.topLeft} logger={logger} />
			</div>
			<div className="topRightSquare">
				<SquareComponentMemo root={content.topRight} logger={logger} />
			</div>
			<div className="bottomLeftSquare">
				<SquareComponentMemo root={content.bottomLeft} logger={logger} />
			</div>
			<div className="bottomRightSquare">
				<SquareComponentMemo root={content.bottomRight} logger={logger} />
			</div>
		</div>
	);
}
