/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
import React, {useState, useEffect} from 'react';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogflowConfig} from './env';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {SafeAreaView, StyleSheet} from 'react-native';

const botAvatar = require('./assets/images/bot.png');

const Bot = {
  _id: 4,
  name: 'Mr. Bot',
  avatar: botAvatar,
};

const ChatApp = () => {
  const [messages, setMessages] = useState([
    {
      _id: 3,
      text: 'How can I help You ?',
      createdAt: new Date(),
      user: Bot,
    },
    {
      _id: 2,
      text: 'I am Succesivian Bot',
      createdAt: new Date(),
      user: Bot,
    },
    {
      _id: 1,
      text: 'Hi!',
      createdAt: new Date(),
      user: Bot,
    },
  ]);

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig?.client_email,
      dialogflowConfig?.private_key,
      Dialogflow_V2?.LANG_ENGLISH_US,
      dialogflowConfig?.project_id,
    );
  }, []);

  const onSend = message => {
    setMessages(previousMessages => {
      return GiftedChat.append(previousMessages, message);
    });
    let msg = message[0].text;
    console.log(message);
    Dialogflow_V2.requestQuery(
      msg,
      result => {
        console.log('result', result);
        handleGoogleResponse(result);
      },
      error => {
        console.log(error);
      },
    );
  };

  const handleGoogleResponse = result => {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    sendBotResponse(text);
  };

  const sendBotResponse = text => {
    if (text == 'Technologies') {
      let msg = {
        _id: messages.length + 1,
        text: 'Please choose the technology',
        createdAt: new Date(),
        user: Bot,
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: [
            {title: 'React-Native', value: 'React-Native'},
            {title: 'Flutter', value: 'Flutter'},
            {title: 'Others', value: 'Others'},
          ],
        },
      };
      setMessages(previousMessages => {
        return GiftedChat.append(previousMessages, [msg]);
      });
    } else {
      let msg = {
        _id: messages.length + 1,
        text,
        createdAt: new Date(),
        user: Bot,
      };
      setMessages(previousMessages => {
        return GiftedChat.append(previousMessages, [msg]);
      });
    }
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {color: 'red'},
          left: {color: 'blue'},
        }}
        wrapperStyle={{
          left: {backgroundColor: 'white'},
          right: {backgroundColor: 'yellow'},
        }}
      />
    );
  };

  const onQuickReply = props => {
    let msg = {
      _id: messages.length + 1000000,
      text: props[0].value,
      createdAt: new Date(),
      user: Bot,
    };
    onSend([msg]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        renderBubble={props => renderBubble(props)}
        messages={messages}
        onQuickReply={props => onQuickReply(props)}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
          avatar: botAvatar,
        }}
      />
    </SafeAreaView>
  );
};

export default ChatApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
