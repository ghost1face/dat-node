## DAT

TODO

## Contributing Code

These guidelines will help get you started so that you may get your code submitted to us in the form of a pull request ASAP.

### Setting up your environment

First and foremost clone or fork and clone the repo and change into the directory of the repo.

```
git clone https://github.com/ghost1face/dat-node.git
cd dat-node

OR

git clone https://github.com/ghost1face/[YOUR_USERNAME]/dat-node.git
cd dat-node
```

Next, install the version of Node.js listed in the `.node-version` or `.nvmrc` file.  This can be managed through common tools such as [nvm](https://github.com/creationix/nvm), [nvm-windows](https://github.com/coreybutler/nvm-windows) or [avn](https://github.com/wbyoung/avn).

```
nvm install [NODE_VERSION]
nvm use [NODE_VERSION]
```

This can also be automated through one of the above tools, or through bash/command prompt if needed:

```
// bash
nodever=$(cat .node-version)
nvm install $nodever
nvm use $nodever

// cmd/powershell
set /p nodever=<.node-version
nvm install %nodever%
nvm use %nodever%
```

Install all packages:

```
npm install
```

### Testing changes

A test suite is configured for validations to changes.  If a new feature is added, we ask that you add a test validating the feature.  Tests can be run through the command `npm test`.  To successfully execute all tests, `DAT` uses a `Dockerfile` to get started with a preconfigured image and a container for quick database testing.  To get started make sure you have [Docker](https://www.docker.com/community-edition) and any prerequisites installed.  The Dockerfile uses `microsoft/mssql-server-linux:2017-latest` as a base image, windows users make sure to enable Linux Containers on windows.

#### Building DAT Image

Navigate to the `docker` directory and run:

```
// builds an image from the Dockerfile
docker build -t datimage .

// starts a container which runs SQL Server on port 1433
docker run -d -p 1433:1433 --name [NAME_TAG] datimage

// now you can stop the container anytime
docker stop [NAME_TAG]

// no need to build and run, you can just start your container again
docker start [NAME_TAG]
```

## FAQ

Q: DAT won't work with named instances and integrated security?
A: No, tedious driver does not support this.  See this issue as a potential way to solve: https://github.com/tediousjs/tedious/issues/118

Q: DAT won't work with integrated security localhost?
A: SQL Server Network Configuration TCP/IP has to be enabled to listen on port 1433, afterwards restart SQL service

## License

MIT

