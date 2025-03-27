# giglife-frontend

Website for joingiglife.com.

## .gitignore

Use the following .gitignore files for ignoring unnecessary files in this repository:

- [Firebase](https://github.com/github/gitignore/blob/main/Firebase.gitignore)
- [Node (for React/JavaScript)](https://github.com/github/gitignore/blob/main/Node.gitignore)

## Firebase

Create a project using the Spark (free) plan.

### Firebase Hosting

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
```
