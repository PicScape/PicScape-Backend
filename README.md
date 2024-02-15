<p align="center">
  <img width="200" src="https://github.com/AIO-Develope/PicScape-Backend/assets/69240351/1871f723-4f44-4a54-b093-02705324e287">
</p>

<h1 align="center" id="picscape-backend">
    PicScape-Backend
    <br>
    <div align="center"></div>
    <img src="https://img.shields.io/badge/Express-v4.18.2-bgrightgreen" align="center"/>
    <img src="https://img.shields.io/badge/NodeJs-v20.11.0-green" align="center"/>
    <img src="https://img.shields.io/badge/NPM-v10.4.0-red" align="center"/>
    <img src="https://img.shields.io/badge/Development-active-blue" align="center"/>
</h1>

This is the repository for the __backend__ of the open-source PicScape project. PicScape serves as an archive for profile pictures, banners, and wallpapers. On PicScape, users can discover and share stunning and aesthetic artwork, enhancing their online presence or desktop aesthetics.

## Overview
- [Introduction](#picscape-backend)
- [Project Setup](#project-setup)
- [Project Status](#project-status)
- [API Routes](#api-routes)
- [Reporting Issues](#reporting-issues)


## Project setup
```
npm install
```

### Run in dev mode
```
npm run dev
```

### Run in normal mode
```
npm start
```

### For the complete functionality of this project, the [frontend](https://github.com/AIO-Develope/PicScape-Frontend/) is essential.

## Project Status
PicScape is a relatively new project and it may currently lack some functionality and features. However, I am continually improving the project in the future. Additionally, PicScape will be available as a fully functional service in the future, ready for you to use.

## API Routes
#### idDelete.js
```
POST /api/delete/:id
This endpoint deletes the image specified by the :id parameter.
This action requires an Auth Key to be included in the header for authorization.
```
#### idFetch.js
```
GET /api/images/:id
This endpoint responds with the image specified by the :id parameter.
```
#### randomRoute.js
```
GET /api/random
This endpoint responds with random images from the database. It provides as many images as specified in the "count" query parameter.
```
#### searchRoute.js
```
GET /api/search/:tags
This endpoint searches for images in the database with tags similar to those specified in the URL parameter ":tags".
```
#### uploadRoute.js
```
POST /api/upload
This endpoint allows users to upload image files along with corresponding information such as title, description, and tags. The required keys in the request body are:

 - title [text]
 - description [text]
 - file [file]
 - tags [text] (Note: Multiple "tags" keys can be added in the body, where each "tags" key can only contain one tag as its value.)
 - tags [text] (this is an example if you want to add another tag)

This action requires an Auth Key to be included in the header for authorization.
```
### getUserInformation.js
```
GET /api/authuser
This endpoint responds with the username and uuid associated with the authentication key sent in the header.

GET /api/uuiduser/:uuid
This endpoint responds with the username associated with the UUID sent in the parameters.
```
### loginRoute.js
```
POST /api/login
The endpoint provides the JWT authentication key only if the username and password sent in the request body correctly correspond to a registered user.

GET /api/verifyToken
This endpoint verifies if the sent token in the header is still valid.
```
### registerRoute.js
```
POST /api/register
This endpoint receives a request with a password and username in the body, then generates a UUID for the user and adds it to the users database
```

## Reporting Issues

If you encounter any problems while using PicScape or have suggestions for improvement, please don't hesitate to open an issue on the GitHub repository. Your feedback is crucial in helping me identify areas for enhancement and address any issues that arise.

To report an issue:

1. Go to the [Issues](https://github.com/AIO-Develope/PicScape-Backend/issues) section of the repository.
2. Provide a clear and detailed description of the problem you've encountered or the feature you'd like to suggest.
3. If possible, include steps to reproduce the issue or examples to clarify your suggestion.
5. Add any relevant files.

Thank you for your help.

