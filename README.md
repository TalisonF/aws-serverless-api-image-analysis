
# Serverless Framework Node HTTP API on AWS to analyse images from url

This aplication can analyse images by the url, using AWS Rekognition. demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.


## Usage

### Installing

You need Node.JS version 14
```
$ npm install
```

### Deployment
For run it, you need before configurate your aws-cli keys
```
$ serverless deploy
```

After deploying, you should see output similar to:

```bash
Deploying aws-serverless-api-image-analysis to stage dev (us-east-1)

✔ Service deployed to stack aws-serverless-api-image-analysis-dev (49s)

endpoint: GET - https://4hw8pzszeg.execute-api.us-east-1.amazonaws.com/analyse
functions:
  img-analysis: aws-serverless-api-image-analysis-dev-img-analysis (16 MB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. 

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/analyse?imageUrl=https://i.imgur.com/hQCI1w3.jpg
```

Which should result in response similar to the following:

```raw
A imagem tem:
96.70% de ser do tipo Sofá
96.70% de ser do tipo móveis
94.34% de ser do tipo gato
94.34% de ser do tipo animal de estimação
94.34% de ser do tipo animal
94.34% de ser do tipo mamífero
93.94% de ser do tipo gatinho
```

### Local development

You can invoke your function locally by using the following command:

```bash
sls invoke local -f img-analysis --path request.json 
```

Which should result in response similar to the following:

```
{
    "statusCode": 200,
    "body": "A imagem tem:\n96.70% de ser do tipo Sofá\n96.70% de ser do tipo móveis\n94.34% de ser do tipo gato\n94.34% de ser do tipo animal de estimação\n94.34% de ser do tipo animal\n94.34% de ser do tipo mamífero\n93.94% de ser do tipo gatinho\n"
}
```


Alternatively, it is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```

To learn more about the capabilities of `serverless-offline`, please refer to its [GitHub repository](https://github.com/dherault/serverless-offline).
