# Working with the React UI

This file explains how to work with Asynqmon UI.

## Introduction

The Asynqmon UI was bootstrapped using [Create React App](https://github.com/facebook/create-react-app), a popular toolkit for generating React application setups. You can find general information about Create React App on [their documentation site](https://create-react-app.dev/).

Instead of plain JavaScript, we use [TypeScript](https://www.typescriptlang.org/) to ensure typed code.

## Development environment

To work with the React UI code, you will need to have the following tools installed:

- The [Node.js](https://nodejs.org/) JavaScript runtime.
- The [Yarn](https://yarnpkg.com/) package manager.
- _Recommended:_ An editor with TypeScript, React, and [ESLint](https://eslint.org/) linting support. See e.g. [Create React App's editor setup instructions](https://create-react-app.dev/docs/setting-up-your-editor/). If you are not sure which editor to use, we recommend using [Visual Studio Code](https://code.visualstudio.com/docs/languages/typescript). Make sure that [the editor uses the project's TypeScript version rather than its own](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript).

**NOTE**: When using Visual Studio Code, be sure to open the `ui/` directory in the editor instead of the root of the repository. This way, the right ESLint and TypeScript configuration will be picked up from the React workspace.

## Installing npm dependencies

The React UI depends on a large number of [npm](https://www.npmjs.com/) packages. These are not checked in, so you will need to download and install them locally via the Yarn package manager:

    yarn

Yarn consults the `package.json` and `yarn.lock` files for dependencies to install. It creates a `node_modules` directory with all installed dependencies.

**NOTE**: Remember to change directory to `ui/` before running this command and the following commands.

## Running a local development server

You can start a development server for the React UI outside of a running Asynqmon server by running:

    yarn start

This will open a browser window with the React app running on http://localhost:3000/. The page will reload if you make edits to the source code. You will also see any lint errors in the console.

## Building the app for production

To build a production-optimized version of the React app to a `build` subdirectory, run:

    yarn build

**NOTE:** You will likely not need to do this directly. Instead, this is taken care of by the `build` target in the main Asynqmon `Makefile` when building the full binary.

## Integration into Asynqmon

To build a Asynqmon binary that includes a compiled-in version of the production build of the React app, change to the root of the repository and run:

    make build

This installs npm dependencies via Yarn, builds a production build of the React app, and then finally compiles in all web assets into the Asynqmon binary.
