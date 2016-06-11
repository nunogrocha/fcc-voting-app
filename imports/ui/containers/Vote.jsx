import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Chart from 'chart.js';
var DoughnutChart = require("react-chartjs").Doughnut;

import { Polls } from '../../api/polls.js';

class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      index: null,
    };
  }

  handleSubmit(event) {
    let selectedOption = this.state.selectedOption;
    if (!selectedOption) {
      selectedOption = ReactDOM.findDOMNode(this.refs.pollOption).value.trim();
      Meteor.call('polls.submitOption', this.props.poll._id, selectedOption, (error, result) => {
        if(error) {
          // handle error
        } else {
          console.log(result)
        }
      });
    } else {
      Meteor.call('polls.submitVote', this.props.poll._id, this.state.selectedOption, (error, result) => {
        if(error) {
          // handle error
        } else {
          console.log(result)
        }
      });
    }
  }

  handleChange(event) {
    this.setState({ selectedOption: event.target.value });
  }
  
  render() {
    if(this.props.poll) {
      let chartData = this.props.poll.options.map(function(obj){
        return {
          value: obj.votes,
          color: rndColor(),
          highlight: "#aaa",
          label: obj.name
        }
      });

      var chartOptions = {
        segmentShowStroke : true
      };
      return (
        <div className="container">   
           <div className="card top-margin">
            <div className="card-block" >
              <div className="row">
                <div className="col-sm-6">
                  <fieldset className="form-group">
                    <h3>{this.props.poll.title}</h3>
                    <div><p>Options:</p> {
                      this.props.poll.options.map((obj,key) => {
                        return (<div className="radio" key={key}>
                                  <label>
                                    <input type="radio" name="optionsRadios" onChange={this.handleChange.bind(this)} value={obj.name}/> 
                                    &nbsp; {obj.name}
                                  </label>
                                </div>); 
                      })
                    }</div>
                  </fieldset>
                  <fieldset className="form-group">
                    <label>Submit a new option</label>
                    <input type="text" ref="pollOption" className="form-control" placeholder="Option"/>
                  </fieldset>
                </div>
                <div className="col-sm-6">
                  <DoughnutChart data={chartData} options={chartOptions} width="210" height="210" />
                </div>
              </div>
              <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary-outline" >
                Submit Vote
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
        </div>
      );
    }
    
  }
}

Vote.propTypes = {
  currentUser: PropTypes.object,
};
 
export default createContainer(({ params }) => {
  const { id } = params;
  const pollsHandle = Meteor.subscribe('poll', id);
  const loading = !pollsHandle.ready();
  const p = Polls.findOne(id);
  const pExists = !loading && !!p;
  return {
    currentUser: Meteor.user(),
    poll: pExists ? p : null,
  };
}, Vote);

function rndColor(){
  return '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
}