# Repository Moed
This is the repository for the frontend of the project `Moed`.

Code is pretty fucked up. Don't worry about it. Tight deadlines and stuff.

The frontend is written in [Svelte](https://svelte.dev/). A frontend JavaScript framework made for interactivity. Because we are creating a web based game,
that's our priority. It is also written with [TailwindCSS](https://tailwindcss.com/) as the CSS framework.

## Installation

### Requirements
The frontend requires the next packages to be installed:

- [npm](https://nodejs.org/dist/v16.18.0/node-v16.18.0-x64.msi)

### Install & Start server
Run the next commands to install the development packages and start the server:

```sh
npm i
npm run dev
```

## Structure
- /:
  The root folder is full with configuration files and other stuff. You'd probably never touch this so I won't really go into detail.

- public/:
  The public folder is where all images, videos, and fonts reside. Nothing special is going on here.

- src/:
  This is the folder where the source code reside which I'll explain in detail here. If i don't explain a file or folder in `src/` that is because
  it is too insignificant to be explained.

- src/App.svelte:
  This file is where the `svelte-spa-router` package resides and where you define all hash based routes. This is the way we are routing with the SPA.

- src/app.css:
  Over here is some extra tailwind that couldn't be applied at the tailwind config.

- src/routes:
  Over here are "routes". They aren't real routes because we use hash based routing, but we do keep them in a routes directory for clarification
  that they are all being used by `svelte-spa-router`.

- src/components:
  This folder has all the svelte components being used by the routes. There is fundementally no difference between a `.svelte` file in this folder compared to
  the routes folder, but for maintainability and [SOC](https://en.wikipedia.org/wiki/Separation_of_concerns), you keep them separate. Also components are most
  likely getting re-used in multiple routes, which is what components are used for.

- src/lib:
  This folder has all the extra TypeScript files, that aren't components/routes. It also includes the `client` folder which is getting generated through the
  `npm run generate-client` command.


## Generate OpenAPI
I made a couple Nodejs scripts to generate API calls to our backend server. Since you won't need to have the backend installed locally, or ran locally,
I have created these scripts so you can automate the process of updating all the API calls in the project (including types)

Each time the backend updates, you should run this command:

```sh
npm run generate-client
```
