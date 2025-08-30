# DCST 1005 Systemutvikling


## Introduction

## Running server

### Database Setup

Database used is mysql/mariadb

To setup .env for REST-API, do the following command:

Windows:
```
cd ./Backend/REST-API
(echo MYSQL_HOST= & echo MYSQL_USER= & echo MYSQL_PASSWORD= & echo MYSQL_DATABASE=) > .env
```
Linux:
```
cd ./Backend/REST-API
printf "MYSQL_HOST=\nMYSQL_USER=\nMYSQL_PASSWORD=\nMYSQL_DATABASE=\n" > .env
```

or create a new file in the REST-API folder called ".env" with the content:

```
MYSQL_HOST= 
MYSQL_USER= 
MYSQL_PASSWORD= 
MYSQL_DATABASE=
```

After the environment file is created, insert the information needed for the different variables needed to reach the database.

Here is an example displaying how the information should look like:
```
MYSQL_HOST=192.168.x.x
MYSQL_USER=exampleuser
MYSQL_PASSWORD=examplepassword
MYSQL_DATABASE=exampledatabase
```

If you are using the database on ntnu under namox, or any other database with a FQDN, like "example.com", it would look something like this:
```
MYSQL_HOST=namox.idi.ntnu.no
MYSQL_USER=NTNU-Username
MYSQL_PASSWORD=Password-from-namox
MYSQL_DATABASE=NTNU-Username
```

If you don't have a user for an existing database, you could create one in docker or VM. You have to manually install mysql/mariadb yourself.

The following sql commands would create the database and give a user "srv" all privilegies to that database

```
CREATE USER IF NOT EXISTS 'srv'@'%' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;
CREATE DATABASE IF NOT EXISTS dev;
GRANT ALL ON dev.* to 'srv'@'%';
```

### Webserver

Commands for production:
```
cd ./Frontend/REACT-WEBPAGE
npm i
npm start
```

Commands for development:
```
cd ./Frontend/REACT-WEBPAGE
npm i
npm run dev
```
### REST-API

Commands for production:
```
cd ./Backend/REST-API
npm i
npm start
```

Commands for development:
```
cd ./Backend/REST-API
npm i
npm run dev
```

## Development

### Testing

If any problems occur under testing, look at homepage, navbar and root tests to see how it's done.

Otherwise, contact other team members.

The test should have atleast 80% coverage, but is not enforced by pipeline

### Before Git Push

Always do these commands before push:
```
npm run lint
npm test
```

This ensures that the pipeline errors can be fixed before pushing the code. If the pipeline fails, the push can't be merged into production. Meaning that the code in development has to be fixed through checking those two lines.