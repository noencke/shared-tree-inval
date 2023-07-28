/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { FieldKinds, SchemaAware, SchemaBuilder, ValueSchema } from "@fluid-experimental/tree2";

const builder = new SchemaBuilder("92bd196a-b525-4db2-ae44-a4cfb7a4d626");
export const numberSchema = builder.primitive("number", ValueSchema.Number);
export const stringSchema = builder.primitive("string", ValueSchema.String);

/** RGB Color */
export const colorSchema = builder.struct("color", {
	red: SchemaBuilder.fieldValue(numberSchema),
	green: SchemaBuilder.fieldValue(numberSchema),
	blue: SchemaBuilder.fieldValue(numberSchema),
});

/** A foursquare holds four squares */
export const fourSquareSchema = builder.structRecursive("fourSquare", {
	topLeft: SchemaBuilder.fieldRecursive(FieldKinds.value, () => squareSchema),
	topRight: SchemaBuilder.fieldRecursive(FieldKinds.value, () => squareSchema),
	bottomLeft: SchemaBuilder.fieldRecursive(FieldKinds.value, () => squareSchema),
	bottomRight: SchemaBuilder.fieldRecursive(FieldKinds.value, () => squareSchema),
});

/** A square either holds a single color, or a foursquare */
export const squareSchema = builder.fieldNodeRecursive(
	"square",
	SchemaBuilder.fieldRecursive(FieldKinds.value, colorSchema, () => fourSquareSchema),
);

export const rootField = SchemaBuilder.field(FieldKinds.value, squareSchema);
export const schema = builder.intoDocumentSchema(rootField);
export type Root = (typeof schema)["root"];
export type Square = SchemaAware.TypedNode<typeof squareSchema>;
export type Color = SchemaAware.TypedNode<typeof colorSchema>;
export type FourSquare = SchemaAware.TypedNode<typeof fourSquareSchema>;

export function isColor(obj: unknown): obj is Color {
	const color = obj as Color;
	return (
		typeof color.red === "number" &&
		typeof color.green === "number" &&
		typeof color.blue === "number"
	);
}
