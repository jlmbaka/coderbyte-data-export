# puppeteer-test

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

This projet aims to implement a tools that can be used to scrap (aka export) data from Coderbyte.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for usage, development and testing purposes.
### Prerequisites

You need to have [NodeJS](https://nodejs.org/) installed in order to run this tool.

### Installing

I order to get started with development, clone this projet into your local environment, cd into the projet folder and run the following command to install all the dependencies:

```
$ npm install
```

## Usage <a name = "usage"></a>

In order to use the system to export data from a coderbyte challenge, run the command below, replacing [URL_OF_CODE_CHALLENGE] with the url of the challenge from which you want to scrape data from.
```
$ node index.js [URL_OF_CODE_CHALLENGE]
```