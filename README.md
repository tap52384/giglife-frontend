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
firebase emulators:start

# To deploy your app, use the following command:
# This command seems to look at firebase.json to determine what to deploy.
# I had enabled functions (which may be Cloud Functions like in Google Cloud Platform), but the
# error message I received indicated that I could not deploy those in the Spark billing plan,
# so I created a copy of firebase.json, firebase.json.original, so I could remove the "functions"
# array from firebase.json. After doing so, "firebase deploy" worked.
# Upon successful deployment, the command provides 2 URLs, one for the Firebase console and the
# other to view the app as it is hosted.
firebase deploy
```

There is are domains that are assigned to your application for deployment. You can even use a
custom domain (which is the goal if Firebase works the way we need).

In the Hosting page, it is possible to enable Cloud Logging. Do so as it will help make debugging
the application easier.

## Vite

I'm using Vite to create a React app since I've heard much about it. I'm new to Firebase, React,
Vite, and more, so I will document all that I learn here so that I can understand how it all works.

```bash
cd ~/code/giglife-frontend/public

# Create your first Vite project using a built-in "react-ts" template, which adds support for
# TypeScript
npm create vite@latest . -- --template react-ts
npm install

# Heard a lot about TailwindCSS (tailwindcss.com)
# https://tailwindcss.com/docs/installation/using-vite
npm install tailwindcss @tailwindcss/vite

# To start the local server for testing your changes live
cd ~/code/giglife-frontend/public
npm run dev
```

## Development Notes

### .gitignore

Used the following .gitignore files for ignoring unnecessary files in this repository:

- [Firebase](https://github.com/github/gitignore/blob/main/Firebase.gitignore)
- [Node (for React/JavaScript)](https://github.com/github/gitignore/blob/main/Node.gitignore)
