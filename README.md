# AWS Rekognition Face Analysis
A simple Node.js application to analyze faces within an image using AWS Rekognition.

## Introduction
This repository contains a simple Node.js application which can be used to analyze faces within an image using AWS Rekognition. The image which should get analyzed has to get passed to the application as an argument. In the results, characteristics like gender, age and emotions are displayed for all detected faces based on a defined required amount of confidence (90% as default). Feel free to adjust the parameters based to your needs.

## Installation
The application uses the aws-sdk as a dependency. Please run ```npm install``` before using it.

## Configuration
You can configure the following settings within the ```settings``` constant at the beginning of the ```detect.js``` file:
- **AWSAccessKeyID:** The ID of your AWS Access Key
- **AWSSecretAccessKey:** Your AWS Secret Access Key
- **AWSRegion:** The AWS Region in which you want to operate AWS Rekognition
- **Confidence:** The minimum required confidence level for faces

## Usage
Simply pass the path to an image file as an argument when calling the Node.js application, for example:
```bash
node analyze.js "C:\Path\Special Images\example.jpg"
```
**Note:** AWS Rekognition currently only supports JPEG and PNG images!
