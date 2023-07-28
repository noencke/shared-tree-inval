# Shared Tree Inval

This app explores how different interfaces for SharedTree "change events" affect invalidation in a UI framework.
It creates a SharedTree using a mocked Fluid infrastructure and connects it to a UI powered by React.

## Usage

After the initial `npm i`, build the app with `npm run build` and then host a local server with `npm start`.
The app will be hosted at `localhost:3000`.
The app presents a grid of squares; click a square to divide it into four more squares.
Each division creates a new subtree in the SharedTree underneath the square that was clicked.
The squares create a [visual representation of the tree structure](https://en.wikipedia.org/wiki/Treemapping); the smaller the square is, the deeper it is in the tree.

## Metrics

To evaluate different strategies for React interop, it's useful to know how often component renders are occurring.
This app uses a simple [logger](./src/logger.ts) that components use to notify the app of when renders occur.
To view the render counts live while using the app, enable `DISPLAY_METRICS` in [globals.ts](./src/globals.ts).

## Tree Hooks and Memoization

### useTree

The [`useTree`](./src/useTree.ts) hook is meant to consume the root node of a tree in the app's root React component.
Anytime anything in the tree changes, it will cause the root component to rerender (therefore causing all components to rerender).
This is simple, but inefficient for large trees.
For example, if a single leaf node changes in a deep tree, it is a waste to rerender every single component in the app since most of them do not consume the data in that leaf node.
**This requires only a single event on the SharedTree: one which fires any time anything in the tree changes.**

### Memoization

One solution to reduce invalition is to [memoize](https://legacy.reactjs.org/docs/react-api.html#reactmemo) them.
A memoized component will not rerender so long as its props/state have not changed.
This is an effective strategy when using a state library like [Redux](https://react-redux.js.org/) with React.
Whenever a state change occurs, objects in the redux store are replaced (i.e. the whole state is a new javascript object), but they are never mutated.
This ensures that any React components consuming those objects will also observe the difference and will rerender.
Unfortunately, the SharedTree does not work this way; it _does_ mutate data in place.
Therefore, it is easy to run into a scenario where a React component doesn't render when we want it to (for example, when a component renders data from a node and its children, and one of the children changes under the parent).
The native React memo function thus does not play nicely with a straightforward distribution of the SharedTree's data throughout component props.

### memoTree

The [`memoTree`](./src/memoTree.ts) function is a prototype of how we could create our own replacement for React's `memo` (which uses `memo` under the hood), but does the extra work necessary to track inval.
Using `memoTree`, a component that consumes a subtree of a SharedTree can be made to rerender anytime anything in that subtree changes.
However, it remains shielded against invalidations above it, i.e. when its parent component renders, it will not render (unless its props/state have changed).
Therefore `memoTree` allows us to provide the same benefit you get from typical use of React's `memo`.
**This strategy relies on the SharedTree providing an event on every node that fires when anything changes in the subtree of which that node is the root.**

To try this out in this app, enable `MEMOIZE_SQUARES` in [globals.ts](./src/globals.ts).
Observe the dramatic difference in render counts with and without memoization.

### Selectors

A more flexible approach (not implemented here) would be to mimic Redux and leverage a context/provider to make the root of the tree globally available to any component.
When a component wants to read a particular state, it calls a special hook and passes to it a selector function, which takes the root of the tree and walks to some subtree.
The hook then registers a listener for changes to that subtree and returns the subtree.
When that subtree changes, the component is rerendered.
This approach allows any component to acquire any state it wants and to render precisely when that state changes.
The built-in React `memo` function is compatible with this approach because components acquire their tree state via the hook and not via props.
