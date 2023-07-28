/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import "./style.css";
import { ISharedTreeContext, useTree } from "../useTree";
import { Root } from "../schema";
import SquareComponent from "./Square";
import { AppLogger } from "../utilities";

export default function AppComponent({
	treeRoot,
	logger,
}: {
	treeRoot: ISharedTreeContext<Root>;
	logger?: AppLogger;
}): JSX.Element {
	const square = useTree(treeRoot);

	return (
		<div className="app">
			<SquareComponent root={square} logger={logger} />
		</div>
	);
}
