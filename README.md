SAE Dashboard
===============
This repository contains a map-based dashboard that displays subnational model results. Users can configure it to show different kinds of model data. The sample data provided shows family planning model output in Senegal.


Disclaimer
------------
The code in this repository was developed by IDM to support our research. We’ve made it publicly available under the MIT License to provide others with a better understanding of our research and an opportunity to build upon it for their own work. We make no representations that the code works as intended or that we will provide support, address issues that are found, or accept pull requests. You are welcome to create your own fork and modify the code to suit your own modeling needs as contemplated under the MIT License.

This project uses geographic data from GADM.org. The data is downloaded when users follow steps to start the project.  Please note there is a gadm license as follows:

```
GADM license

The data are freely available for academic use and other non-commercial use. 
Redistribution or commercial use is not allowed without prior permission. 

Using the data to create maps for publishing of academic research articles 
is allowed. Thus you can use the maps you made with GADM data for figures 
in articles published by PLoS, Springer Nature, Elsevier, MDPI, etc. You are
allowed (but not required) to publish these articles (and the maps they 
contain) under an open license such as CC-BY as is the case with PLoS journals
and may be the case with other open access articles. Data for the following
countries is covered by a a different license Austria: Creative Commons 
Attribution-ShareAlike 2.0 (source: Government of Ausria)
```

Prerequisites
------------
To run this project using Docker, you will need the following software:
- [Docker desktop](https://www.docker.com/products/docker-desktop/)

If you prefer to run the project locally, you will need the following software:
- [Python 3.8](https://www.python.org/downloads/release/python-380/) or later
- [Yarn package manager](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)


Deployment
------------
To deploy the website using [Docker](https://www.docker.com/), follow these steps:

  1. In a terminal, navigate to the repo base directory.
  2. Build the container images using `docker compose -f docker-compose.local.yml build`
  3. Run the containers using `docker compose -f docker-compose.local.yml up -d`
  4. In a browser, navigate to "http://localhost" to see the dashboard

To deploy the website locally without Docker, follow these steps:

  1. From a terminal, navigate to to the /service directory
  2. Follow the instructions in [/service/README](https://github.com/InstituteforDiseaseModeling/SAEDashboard/blob/dev/service/README.md) to deploy the API
  4. From a terminal, cd repo/client
  5. Run `yarn install` to install dependencies for this project
  6. Run `yarn start` to start package and start the development web server.


