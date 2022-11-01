'use strict';

const { promises: { readFile } } = require('fs');

class Handler {

  constructor({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc;
    this.translateSvc = translatorSvc
  }

  async detectImageLabels(buffer) {
    const results = await this.rekoSvc.detectLabels({
      Image: {
        Bytes: buffer
      }
    }).promise();

    const workingItems = results.Labels
      .filter(({ Confidence }) => Confidence > 80);

    const names = workingItems
      .map(({ Name }) => Name)
      .join(' and ');

    return { names, workingItems };
  }

  async TranslateText(text) {
    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: text
    }
    const { TranslatedText } = await this.translateSvc
      .translateText(params)
      .promise();

    return TranslatedText.split(' e ');
  }

  formatTextResults(texts, workingItems){
    const finalText = [];
    for (const indexText in texts) {
      const nameInPortuguese = texts[indexText];
      const confidence = workingItems[indexText].Confidence;

      finalText.push(
        `${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}\n`
      )  
    }

    return finalText;
  };
  async main(event) {
    try {
      const imgBuffer = await readFile('./images/cat.jpg');
      console.log('Detecting labels...');
      const { names, workingItems } = await this.detectImageLabels(imgBuffer);
      console.log('Translating to Portuguese...');
      const texts = await this.TranslateText(names);
      console.log('handling final object...');
      const response = this.formatTextResults(texts, workingItems);
      return {
        statusCode: 200,
        body: 'A imagem tem ' + response
      }

    } catch (error) {
      console.log("----- ERROR -----", error);
      return {
        statusCode: 500,
        body: 'Internal server error!'
      };
    }
  }
}


// factory 

const aws = require("aws-sdk");

const reko = new aws.Rekognition();
const translator = new aws.Translate();

const handler = new Handler({
  rekoSvc: reko,
  translatorSvc: translator
});

module.exports.main = handler.main.bind(handler);
