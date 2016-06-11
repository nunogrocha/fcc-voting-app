import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Polls = new Mongo.Collection('polls');
 
if (Meteor.isServer) {
  Meteor.publish('myPolls', function() {
    return Polls.find({ 
      owner: this.userId 
    });
  });
  
  Meteor.publish('polls', function pollsPublication() {
    return Polls.find({ });
  });
  
  Meteor.publish('poll', function(pollId) {
    return Polls.find({ 
      _id: pollId
    });
  });
}

Meteor.methods({
  'polls.get'(pollId) {
    check(pollId, String);
    
    const poll = Polls.findOne(pollId);
    if(poll) {
      return poll;
    }
  },
  'polls.submitVote'(pollId, optionName) {
    check(pollId, String);
    check(optionName, String);
    return Polls.update(
      { 
        _id: pollId,
        "options.name": optionName
      },
      { 
        $inc: {
          "options.$.votes": 1
        }
      }
    );
  },
  'polls.submitOption'(pollId, optionName) {
    check(pollId, String);
    check(optionName, String);
    return Polls.update(
      { 
        _id: pollId
      },
      { 
        $addToSet: {
          "options": {
            name: optionName,
            votes: 1
          }
        }
      }
    );
  },
  'polls.insert'(title, options) {
    check(title, String);
 
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    return Polls.insert({
      title,
      options,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'polls.remove'(pollId) {
    const poll = Polls.findOne(pollId);
    if (poll.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Polls.remove(pollId);
  }
});