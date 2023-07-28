/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import {
	FieldKindTypes,
	GlobalFieldSchema,
	ISharedTree,
	SchemaAware,
	SharedTreeFactory,
	TreeSchema,
	TypedSchemaCollection,
} from "@fluid-experimental/tree2";
import {
	MockContainerRuntimeFactory,
	MockFluidDataStoreRuntime,
	MockStorage,
} from "@fluidframework/test-runtime-utils";

import React from "react";
import { AllowedUpdateType } from "@fluid-experimental/tree2";

/**
 * Create and initialize a SharedTree against mock services.
 * @param schema - the schema of the tree
 * @param initialTree - the initial contents of the tree
 * @returns an object that can be passed to {@link useTree} in the root component.
 * @remarks This should be called once during application initialization.
 * This function currently only supports SharedTree schema with a single value at the root.
 */
export function initTree<Schema extends GlobalFieldSchema>(
	schema: TypedSchemaCollection<Schema>,
	initialTree: SchemaAware.TypedField<Schema["schema"], SchemaAware.ApiMode.Simple>,
): ISharedTreeContext<Schema> {
	return new SharedTreeContext(schema, initialTree);
}

/**
 * Consumes an object created by {@link initTree} and registers the current React component for invalidation.
 * @param context - an object created by {@link initTree}
 * @returns the data at the root of the tree.
 * @remarks This component in which this hook is called will render anytime that any data in the tree changes.
 * This hook currently only supports SharedTree schema with a single value at the root.
 */
export function useTree<Schema extends GlobalFieldSchema>(
	context: ISharedTreeContext<Schema>,
): SchemaAware.TypedNode<TypedRootNode<Schema>> {
	const [, setState] = React.useState({});
	const invalidate = () => setState({});
	React.useEffect(() => context[treeSymbol].events.on("afterBatch", invalidate));
	return context[treeSymbol].root as TypedRootNode<Schema>;
}

/** Extracts the root {@link TreeSchema} from a {@link GlobalFieldSchema} */
type TypedRootNode<Schema extends GlobalFieldSchema> = Schema extends GlobalFieldSchema<
	FieldKindTypes,
	infer Types
>
	? Types extends [infer X]
		? X extends TreeSchema
			? X
			: never
		: never
	: never;

const treeSymbol = Symbol("Root Shared Tree");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/** Produced by {@link initTree} and consumed by {@link useTree} */
export interface ISharedTreeContext<Schema extends GlobalFieldSchema> {
	readonly [treeSymbol]: ISharedTree;
}

/** Facilitates strong typing between {@link initTree} and {@link useTree} */
class SharedTreeContext<Schema extends GlobalFieldSchema> implements ISharedTreeContext<Schema> {
	public readonly [treeSymbol]: ISharedTree;

	public constructor(
		schema: TypedSchemaCollection<Schema>,
		initialTree: SchemaAware.TypedField<Schema["schema"], SchemaAware.ApiMode.Simple>,
	) {
		const runtime = new MockFluidDataStoreRuntime();
		const factory = new SharedTreeFactory();
		this[treeSymbol] = factory.create(runtime, "SharedTree Inval");
		this[treeSymbol].schematize({
			schema,
			initialTree: initialTree,
			allowedSchemaModifications: AllowedUpdateType.SchemaCompatible,
		});

		const containerRuntime = new MockContainerRuntimeFactory().createContainerRuntime(runtime);

		this[treeSymbol].connect({
			deltaConnection: containerRuntime.createDeltaConnection(),
			objectStorage: new MockStorage(),
		});
	}
}
