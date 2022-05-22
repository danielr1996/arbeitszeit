# arbeitszeit
Visualize daily working time from [Kimai](https://www.kimai.org/)

<img width="1000" alt="image" src="https://user-images.githubusercontent.com/6663726/169676418-471abff2-0e5d-4c7c-a472-c5d8648da344.png">

## Usage
1. Login to your kimai instance and configure an API password according to the [documentation](https://www.kimai.org/documentation/rest-api.html#authentication) 
(this is different from your password to log into the user interface and needs to be set explicitly)
2. Go to [arbeitszeit.vercel.app](https://arbeitszeit.vercel.app) and 
login in with the previously created credentials and the url of your kimai instance. If you are using [kimai cloud](https://www.kimai.cloud/de/)
your URL is something like `https://<username>.kimai.cloud`

## Features
> This is not a complete replacement for the kimai user interface, it's an app I've
> written for my self to add features not present in kimai, depending on how you use
> kimai you will probably still need to use the kimai user interface.

* See when you started working, how long still need work and your overtime
* Start / Stop a timesheet with a single button click

## Motivation
While [Kimai](https://www.kimai.org/) is a great tool for time tracking it has some
drawbacks, the most important for me beeing

* Kimai doesn't show you the total overtime, overtime per day or even the sum of
hours worked in a day
* Kimai forces you to select a project and activity even if you only have on default
of each configured which makes it unnecessary complicated to start a new timesheet

While these issues could be addressed by a kimai plugin or submitted as changes to
the kimai codebase I didn't really want to use PHP for this and decided to create
this in React, also kimai has a nice Rest API which makes it really easy to write a 
seperate client.

## Developing
```bash 
npm install
npm start
```