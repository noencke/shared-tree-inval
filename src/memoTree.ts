/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { SchemaAware, TreeSchema, EditableTree, on } from "@fluid-experimental/tree2";
import React, { FunctionComponent } from "react";

/**
 * Memoizes the given function component which consumes state from a SharedTree.
 * @param component - the component to memoize.
 * It must have a `root` prop which contains a SharedTree node.
 * @returns the memoized component
 */
export function memoTree<P extends { root: SchemaAware.TypedNode<TreeSchema, any> }>(
	component: FunctionComponent<P>,
) {
	const connectedComponent = (props: P) => {
		const [, setState] = React.useState({});
		const invalidate = () => setState({});
		const tree = props.root as EditableTree;
		React.useEffect(() => tree[on]("subtreeChanging", invalidate));
		return component(props);
	};
	if (component.displayName !== undefined) {
		connectedComponent.displayName = `${component.displayName}-Tree-Memo`;
	}
	return React.memo(connectedComponent);
}
