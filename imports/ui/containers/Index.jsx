import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Polls } from '../../api/polls.js';
 
import Poll from '../components/Poll.jsx';

class Index extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
    };
  }

  renderPolls() {
    let filteredPolls = this.props.polls;
    return filteredPolls.map((poll) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showDelete = poll.owner === currentUserId;
 
      return (
        <Poll
          key={poll._id}
          poll={poll}
          showDelete={showDelete}
        />
      );
    });

  }

  render() {
    return (
      <div>
        <div className="container">  
          <div className="card-columns">
            {this.renderPolls()}
          </div>
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  polls: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  Meteor.subscribe('polls');
  
  return {
    polls: Polls.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
}, Index);