import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Polls = new Mongo.Collection('polls');
 
if (Meteor.isServer) {
  Meteor.publish('polls', function pollsPublication() {
    return Polls.find({ 
      //owner: this.userId 
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
  'polls.insert'(title, options) {
    check(title, String);
 
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Polls.insert({
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
  },
  /*
  'polls.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
 
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
    
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  */
  /*
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
 
    const task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
  */
});