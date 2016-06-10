import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Polls } from '../../api/polls.js';

class CreatePoll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: []
    };
  }
  
  handleSubmit(event) {
    event.preventDefault();
    const title = ReactDOM.findDOMNode(this.refs.pollTitle).value.trim();
    
    if (title && ReactDOM.findDOMNode(this.refs.pollArea).value.trim()) {
      
      let formatOptions = this.state.options.map((obj) => {
        return { name: obj, votes: 0 }
      })
      
      Meteor.call('polls.insert', title, formatOptions);
    } else {
      this.setState({error: true});
      alert("Fill all fields");
    }
  }

  handleChange(event) {
    let options = ReactDOM.findDOMNode(this.refs.pollArea).value.trim();
    const splitOptions = options.split(',');
    this.setState({options: splitOptions});
  }

  render() {
    const taskClassName = classnames({
      'form-control-danger form-control': this.state.error,
      'form-control': !this.state.error
    });
    return (
      <div>
        <div className="container">   
           <div className="card top-margin">
            <form className="card-block" onSubmit={this.handleSubmit.bind(this)}>
              <fieldset className="form-group">
                <label>Poll Title</label>
                <input type="text" className={taskClassName} ref="pollTitle" placeholder="Poll Title"/>
              </fieldset>
              <fieldset className="form-group">
                <label>Options (separated by comma)</label>
                <textarea className={taskClassName} ref="pollArea" rows="3" onChange={this.handleChange.bind(this)}></textarea>
                <small class="text-muted">Options: {
                  this.state.options.map((obj) => {
                    return <span className="label label-default margin-right-xs">{obj}</span>;
                  })
                }</small>
              </fieldset>
              <button type="submit" className="btn btn-primary-outline" >
                Add Poll
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CreatePoll.propTypes = {
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  Meteor.subscribe('polls');
  
  return {
    polls: Polls.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, CreatePoll);