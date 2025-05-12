# giglife-frontend

Website for joingiglife.com.

## Firebase

Create a project using the Spark (free) plan. To get started, go to the Dashboard of your project
and find **Hosting**. There, you will find how to initialize using Firebase in the repository for
your web site by:

- installing the Firebase CLI
- initializing Firebase folders in your repository

**App Check** seems to be a feature designed to prevent users from sending too much traffic to
your site, driving up costs. Make sure this is done prior to going to production to prevent any
surprises. Automatic builds and deployments are also disabled to prevent surprise costs.

### Firestore + Security Rules

What is Firestore? It's what they call their database, which is a "flexible, scalable NoSQL cloud
database." I got a warning because by default, since I have the database in "Test Mode," anyone
with the FIrestore database reference to the site can view, edit, and delete all data in the
database. This is what the default rules look like:

```json
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // This rule allows anyone with your Firestore database reference to view, edit,
    // and delete all data in your Firestore database. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Firestore database will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // all client requests to your Firestore database will be denied until you Update
    // your rules
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 5, 1);
    }
  }
}
```

### Hosting

There are *Product Categories* on the dashboard for your project in Firebase. Under *Build*, there
is *Hosting* and *App Hosting* (which is in beta and cannot be used with the free plan).

You will need to install the Firebase CLI on your system:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# In your project repository, initialize Firebase in your app's root directory
cd ~/code

# Clone this repository only if it hasn't been done already
[ ! -d giglife-frontend] && git clone https://github.com/tap52384/giglife-frontend.git


# Initialize your web app with Firebase by first signing in; this will open a tab in your web browser
firebase login

# Initialize a Firebase project in this directory
# Select the following features:
# Functions, Hosting
# If you haven't created your Firebase project yet, go do so from the web first
# When writing Cloud Functions, use Python or any language that is comfortable for you. However,
# with Python you can use Python packages which can be really useful.
# When asked if you want to install Python dependencies, go ahead and do so.
# It looks like you can set up automatic builds and deploys with GitHub; I'm assuming that may cost
# somehow, so say no (the default)
firebase init

# Initialize Firebase Firestore, which is the cloud database for your app; this
# seems to work better than using "firebase init" and selecting firestore as some files
# were added to the code base
firebase init firestore

# According to this page, it is possible to emulate the "Hosting" capabilities of Firebase locally
# for better testing before deployment. To "deploy" means to send your code to the remote Firebase
# servers so that your web page can be accessed via the web from a provided URL.
# https://firebase.google.com/docs/hosting/#implementation_path
# This command can start emulators for the different services (Firestore, Hosting, Auth, etc.)
# which can be accessed from localhost and a specific port.

# To start all emulators:
firebase emulators:start --only hosting,functions

# To deploy your app, use the following command:
# This command seems to look at firebase.json to determine what to deploy.
# I had enabled functions (which may be Cloud Functions like in Google Cloud Platform), but the
# error message I received indicated that I could not deploy those in the Spark billing plan,
# so I created a copy of firebase.json, firebase.json.original, so I could remove the "functions"
# array from firebase.json. After doing so, "firebase deploy" worked.
# Upon successful deployment, the command provides 2 URLs, one for the Firebase console and the
# other to view the app as it is hosted.

# 2025/05/04 - I have configured the firebase.json in the frontend repo to reference the "functions"
# folder of the backend repo. Now I can deploy from here just like I can test from here and it
# work just fine.
firebase deploy
```

There is are domains that are assigned to your application for deployment. You can even use a
custom domain (which is the goal if Firebase works the way we need).

In the Hosting page, it is possible to enable Cloud Logging. Do so as it will help make debugging
the application easier.

## Folder Structure

gig-life/
├── .firebaserc                  # Firebase project configuration (project aliases)
├── firebase.json                # Firebase Hosting settings
├── functions/                   # (Optional) Firebase Cloud Functions, if used later
├── public/                      # Public static files (favicon, manifest), NOT app root
│   └── (optional static assets, not React build)
├── src/                         # Source code for React app
│   ├── assets/                  # Static assets like images, SVGs
│   ├── components/              # Reusable UI elements (Button, Navbar, etc.)
│   ├── features/                # Feature-based UI sections (Hero, Benefits, etc.)
│   │   └── Home/
│   ├── pages/                   # Route-level components like HomePage
│   ├── routes/                  # Route configs for react-router
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utility functions, constants, etc.
│   ├── styles/                  # Tailwind + global styles
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── dist/                        # Output folder generated by Vite after build
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md

## Vite

I'm using Vite to create a React app since I've heard much about it. I'm new to Firebase, React,
Vite, and more, so I will document all that I learn here so that I can understand how it all works.

```bash
cd ~/code/giglife-frontend

# Create your first Vite project using a built-in "react-ts" template, which adds support for
# TypeScript
npm create vite@latest . -- --template react-ts

# Heard a lot about TailwindCSS (tailwindcss.com)
# https://tailwindcss.com/docs/installation/using-vite
# shadcn was recommended by ChatGPT, so we will use that for components
# https://ui.shadcn.com
npm install -D @types/node @tailwindcss/postcss autoprefixer postcss tailwindcss @tailwindcss/vite
npm install react-router-dom

# To start the local server for testing your changes live in the Vite app
npm run dev

# However, just because npm run dev works doesn't mean it works by default with Firebase
# you can start just the Hosting emulator for Firebase:
firebase emulators:start --only hosting

# Good thing to know: when you use this command, "npm run build," the react code is broken down
# to its simpler javascript, css, and html files so that it can be run in production
npm run build
```

By using the emulators locally, you can test how the website will behave without running
`firebase deploy`.

Using the command above, I installed Vite from the root of the repository by ignoring existing files.
This requires editing `firebase.json` for the `hosting/public` key to use `dist` as the folder to
deploy, as Vite will build the site into that folder. Yyou have to run
`npm run build` to build the React assets for production for this to
work.

### Editing Code

By default, it looks like Vite is a single-page client-side application where all React code is
run from `index.html`. The React JavaScript/TypeScript code is in the `src` folder.
The file `index.html` launches the main module from `src/main.tsx`.

Based on the original `index.html` created by Vite, I would edit `src/App.tsx`. I saved the original
`index.html` as `index.html.original` just in case.

### Configuring app for TailwindCSS and ShadCN/UI

These steps assume that you created the Vite app, installed TailwindCSS and run `npm run dev`
to make sure it all works before moving forward, which is outlined above in the **Vite** section.

To add ShadCN/UI, follow [the instructions here](https://ui.shadcn.com/docs/installation/vite).

### NPX

What is npx? NPX, which stands for Node Package eXecute, is a tool that comes installed with `npm`.
It allows you to run Node.js packages without installing them globally or locally, which can be
useful for one-off tasks or testing packages without cluttering your system.

Running `npx` creates a bourne shell instance within your terminal.

As of 04/17/2025, the `canary` release of `shadcn/ui` fully supports React 19, but you may be
prompted while using `npx shadcn@latest` to either force install or to `--ignore-peer-deps`.

### Multiple pages with Vite + React

[The documentation](https://vite.dev/guide/build.html#multi-page-app) shows that you just need to:

- create a folder for the new page within the `public` folder
- update the config object within `vite.config.js` or `vite.config.ts`

If the development server is running (`npm run dev`), any changes to the Vite config file will
cause it to restart.

Modern pages do **client-side routing**, which means that they have a single `index.html` page
as an entry point where going to a new "page" is really swapping out components, which is faster
than making a request to the server (multiple entry points).

## TailwindCSS

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
```

## Development Notes

### .gitignore

Used the following .gitignore files for ignoring unnecessary files in this repository:

- [Firebase](https://github.com/github/gitignore/blob/main/Firebase.gitignore)
- [Node (for React/JavaScript)](https://github.com/github/gitignore/blob/main/Node.gitignore)

### Features to add

- Expiration / Taken - make note whether a gig has already been taken or if it has expired to help
keep the list fresh. Perhaps consider a gig expired if it has not been claimed by 12 PM on the day
the help is needed. Have the expiration time to be configurable somehow in the application to
prevent needing to make code changes.
- "Movie timer for claiming gigs" - have some sort of system like when you reserve a ticket for a
movie where users temporarily have a claim on a gig for a certain period of time (like 5 minutes)
with a visible timer on the page; have this timer be configurable
- @gmail.com addresses - have a "display email" that respects how users enter their email address
but also be smart enough to ignore all plus signs and periods and anything after a plus sign to
avoid multiple signups for the same exact email address
