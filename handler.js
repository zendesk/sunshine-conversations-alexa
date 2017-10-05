
'use strict';

const Smooch = require('smooch-core');

const appId = process.env.APP_ID || '591b60913884d169009e02de';

const smooch = new Smooch({
  keyId: process.env.KEY_ID || 'act_586fca99e1532b45008cbbf2',
  secret: process.env.SECRET || '3GVUJ67voOxr1QH5p5_o_2tQ',
  scope: 'account'
});

const MAX = 15;
const DELAY = 200;

const emit = (cb, text) => cb(null, {
  version: '1.0',
  response: {
    outputSpeech: {
      type: 'PlainText',
      text: text
    },
    shouldEndSession: false
  }
});

const sendResponse = (userId, ts, cb, count=0) => {
  if (count === MAX) {
    return emit(cb, 'Haven\'t heard anything back. Try again later.');
  }

  smooch.appUsers.getMessages(appId, userId, { after: ts })
    .then(data => {
      const content = data.messages
        .filter((message) => message.role === 'appMaker')
        .map((message) => message.text)
        .join('\n');

      if (content) {
        return emit(cb, content)
      }

      setTimeout(sendResponse, DELAY, userId, ts, cb, count + 1);
    })
    .catch(error => {
      console.log('Error retrieving responses', error);
      console.trace(error);
      emit(cb, 'Sorry, there\'s been an error. Try again later.');
    });
};

module.exports.RawText = async function(event, context, cb) {
  const userId = event.session.user.userId;

  const text = event.request
    && event.request.intent
    && event.request.intent.slots
    && event.request.intent.slots.text
    && event.request.intent.slots.text.value;

  const message = { role: 'appUser', type: 'text', text };

  let data;

  if (!text) {
    return emit(cb, 'Can you tell me again?');
  }

  try {
    data = await smooch.appUsers.sendMessage(appId, userId, message);
  } catch (error) {
    try {
      if (false) {
        throw error;
      }

      await smooch.appUsers.create(appId, userId, {});
      data = await smooch.appUsers.sendMessage(appId, userId, message);
    } catch (error) {
      console.log('Error sending message', error);
      console.trace(error);
      return emit(cb, 'Sorry, there\'s been an error. Try again later.');
    }
  }

  sendResponse(userId, data.message.received, cb);
};
