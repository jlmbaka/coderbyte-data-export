# Coderbyte data export

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)

## About <a name = "about"></a>

This projet aims to implsement a tools that can be used to scrap (aka export) data from Coderbyte.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for usage, development and testing purposes.

### Prerequisites

You need to have [NodeJS](https://nodejs.org/) installed in order to run this tool. Moreover, you need an account on Coderbyte.

### Installing

I order to get started with development, clone this projet into your local environment, cd into the projet folder and run the following command to install all the dependencies:

```
$ npm install
```

## Usage <a name = "usage"></a>

Before using this script, you need to fill `config.json` file with the credentials of your Coderbyte account. After successully runing the script as described below, a successful login will authomatically add cookies info to `cookies.json`. We have provided examples for both files. Copy the examples and rename them to match the name aforementionned files, and modify the confent of `config.json` per your credentials.

In order to use the system to export data from a coderbyte challenge, run the command below, replacing [URL_OF_CODE_CHALLENGE] with the url of the challenge from which you want to scrape data from.

```
$ node index.js [URL_OF_CODE_CHALLENGE]
```
