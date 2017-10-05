<!--
title: AWS Serverless Smooch Alexa Skill example in NodeJS
description: This example demonstrates how to setup your own Smooch Alexa skill using AWS Lambdas.
layout: Doc
-->

# Serverless Smooch Alexa Skill Example

This example demonstrates how to setup your own Smooch Alexa skill using AWS Lambdas. It allows Alexa users to send plain-text messages as Smooch appUser messages. It also provides subsequent appMaker messages as responses, if they are received within Alexa's response window. 

## Use-cases

- Deploying chat bots to Alexa
- Creating multi-channel chat experiences that are initiated via Alexa voice commands. Imagine: _Person: Alexa, reserve Magpie Pizzeria for 3 tonight at 7 pm. Alexa: Reserving Magpie restaurant at 7pm. I'll send you confirmation by SMS, Dave._

## How it works

In the Alexa Developer Portal you can add your own skill. To do so you need to define the available intents and then connect them to a Lambda. You can update and define the Lambda with Serverless.

## Setup

_In order to use this example you must have serverless on your machine, follow the instructions [here](https://github.com/serverless/serverless) to install it. If this is your first time using serverless, you will also need to [configure credentials for AWS](https://serverless.com/framework/docs/providers/aws/guide/credentials/) on your local machine._

To install this skill on your machine, run:

```bash
serverless install -u https://github.com/smooch/smooch-alexa -n smooch-alexa
cd smooch-alexa
npm install
```

In _serverless.yml_ replace the sample Smooch account secret key pair and app ID with you own, like so:

```
APP_ID: '591b60913884d169009e02de',
KEY_ID: 'act_586fca99e1532b45008cbbf2',
SECRET: '3GVUJ67voOxr1QH5p5_o_2tQ'
```

In order to deploy the endpoint simply run

```bash
serverless deploy
```

The expected result should be similar to:

```bash
Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading service .zip file to S3 (378 B)...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.........
Serverless: Stack update finished...
Serverless: Removing old service versions...
Service Information
service: smooch-alexa-dev
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  None
functions:
  smooch: smooch-alexa-dev-smooch

```

Next we need to setup an Alexa skill. Once you've signed up for the Amazon Developer Platform visit [the Alexa developer console page](https://developer.amazon.com/edw/home.html). There you should see the following screen and click "Get Started" on "Alexa Skill Kit":

![Welcome](https://cloud.githubusercontent.com/assets/223045/21183285/8403b37c-c207-11e6-89c0-d36582010af8.png)

Next click on `Add a new Skill`:

![Add Skill](https://cloud.githubusercontent.com/assets/223045/21183286/84051262-c207-11e6-8422-945b6b45e83b.png)

Go through the steps and fill in all the required fields e.g. Intent Schema and Sample Utterances:

Intent Schema
```
{
  "intents": [
    {
      "intent": "RawText",
      "slots": [
        {
          "name": "text",
          "type": "AMAZON.LITERAL"
        }]
    },
    {
      "intent": "AMAZON.StopIntent"
    },
    {
      "intent": "AMAZON.CancelIntent"
    }
  ]
}
```

Sample Utterances
```
RawText {word|text}
RawText {this is a sentence|text}
```

Fill in the Lambda ARN with the ARN value displayed in the AWS lambda console (https://console.aws.amazon.com/lambda): Login to your console and open the Lambda that was generated by serverless, the ARN will be displayed on the page.

![Configuration](https://cloud.githubusercontent.com/assets/223045/21183281/83f17086-c207-11e6-89b7-2f6d96ac559c.png)

Next up visit the test page, fill in the utterance and click on `Ask the-name-of-your-skill`.

![Test](https://cloud.githubusercontent.com/assets/223045/21185805/78c1df06-c212-11e6-9cf9-ce44edc30cdd.gif)

You should have received a response containing the text of any appMaker message you've configured to respond, or `"text": "Haven't heard anything back. Try again later."` if no appMaker message was sent.

You can also test your skill using a service like [echosim.io](https://echosim.io/).

Check out this [Amazon guide](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/overviews/steps-to-build-a-custom-skill#your-skill-is-published-now-what) to learn more about how to submit your skill for publication.
