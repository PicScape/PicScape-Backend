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
- [License](#mit-license)
- [Project Setup](#project-setup)
- [Project Status](#project-status)
- [Reporting Issues](#reporting-issues)

## MIT License
__Copyright (c) 2024 Sebastian Felix-Alexander Stepper__

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

By using this software, you agree that the authors of the software shall not be held liable for any direct, indirect, incidental, special, exemplary, or consequential damages arising from the use of this software, including but not limited to procurement of substitute goods or services, loss of use, data, or profits, or business interruption. This disclaimer of liability applies to any damages or injury caused by any failure of performance, error, omission, interruption, deletion, defect, delay in operation or transmission, computer virus, communication line failure, theft or destruction or unauthorized access to, alteration of, or use of record, whether for breach of contract, tortious behavior, negligence, or under any other cause of action.

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
### idDelete.js
```
POST /api/images/delete/:id/
This endpoint deletes the image specified by the :id parameter.
```

## Reporting Issues

If you encounter any problems while using PicScape or have suggestions for improvement, please don't hesitate to open an issue on the GitHub repository. Your feedback is crucial in helping me identify areas for enhancement and address any issues that arise.

To report an issue:

1. Go to the [Issues](https://github.com/AIO-Develope/PicScape-Backend/issues) section of the repository.
2. Provide a clear and detailed description of the problem you've encountered or the feature you'd like to suggest.
3. If possible, include steps to reproduce the issue or examples to clarify your suggestion.
5. Add any relevant files.

Thank you for your help.

