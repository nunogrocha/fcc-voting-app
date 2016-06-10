import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Polls } from '../../api/polls.js';

class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentWillMount() {
    Meteor.call('polls.get', this.props.routeParams.id, (error, result) => {
      if(error) {
      // handle error
      } else {
        this.setState({poll: result});
      }
    });
    console.log(this.props.routeParams)
  }
  
  handleSubmit(event) {
    event.preventDefault();
 
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Meteor.call('polls.insert', title);
 
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  render() {
    const result  = this.state;
    if(result.poll) {
      return (
        <div>
          <div className="container">      
            <div className="card-columns">
              {this.state.poll.username}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Loading...</h3>
        </div>
      );
    }
    
  }
}

Vote.propTypes = {
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  Meteor.subscribe('polls');
  
  return {
    currentUser: Meteor.user(),
  };
}, Vote);