import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Chart from 'chart.js';
var DoughnutChart = require("react-chartjs").Doughnut;

import { Polls } from '../../api/polls.js';

export default class Poll extends Component {

  deleteThisPoll() {
    Meteor.call('polls.remove', this.props.poll._id);
  }
  
  render() {
    let date = moment(this.props.poll.createdAt);
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
    console.log(this.props.poll)
    return (
      <div className="card text-xs-center">
        <div className="card-block">
          <h4 className="card-title">{this.props.poll.title}</h4>
          <h6 className="card-subtitle text-muted">{this.props.poll.username}</h6>
        </div>
        <DoughnutChart data={chartData} options={chartOptions} width="210" />
        <div className="card-block">
          <a href={'/vote/' + this.props.poll._id} className="btn btn-primary-outline">
            Vote
          </a>
          { this.props.showDelete ?
              <button className="btn btn-danger-outline left-spacer" onClick={this.deleteThisPoll.bind(this)}>
                Delete
              </button> : ''
          }
        </div>
        <div className="card-footer text-muted">
          {date.fromNow()}
        </div>
      </div>
    );
  }
}
 
Poll.propTypes = {
  poll: PropTypes.object.isRequired,
  showDelete: React.PropTypes.bool.isRequired,
};

function rndColor(){
  return '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
}
