import React, { Component } from "react";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class EditExercise extends Component {
  state = {
    username: "",
    description: "",
    duration: 0,
    date: new Date(),
    users: []
  };

  componentDidMount() {
    axios.get('http://localhost:5000/exercises/'+this.props.match.params.id)
    .then(response => {
        this.setState({
            username:response.data.username,
            description:response.data.description,
            duration: response.data.duration,
            date: new Date(response.data.date)
        })
    })
    .catch(error => {
        console.log(error);
    })

    axios.get('http://localhost:5000/users/')
    .then(response => {
      if (response.data.length > 0) {
        this.setState( {
          users: response.data.map(user => user.username),
          username: response.data[0].username 
        })
      }
    })
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    };
  

  onChangeDate = date => {
    this.setState({
      date
    });
  }

  onSubmit = e => {
    e.preventDefault();

    const exercise = {
      username: this.state.username,
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date
    };

    console.log(exercise);

    axios.post('http://localhost:5000/exercises/update/'+this.props.match.params.id, exercise)
    .then(res => console.log(res.data));

    window.location = "/";
  }
  render() {
    const { username, description, duration, date, users } = this.state;
    return (
      <div>
        <h3>Edit Exercise Log</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Username: </label>
            <select
              ref="userInput"
              required
              className="form-control"
              name="username"
              value={username}
              onChange={this.onChange}
            >
              {users.map(user => {
                return (
                  <option key={user} value={user}>
                    {user}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group">
            <label>Description: </label>
            <input
              type="text"
              required
              className="form-control"
              name="description"
              value={description}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label>Duration in minutes: </label>
            <input
              type="text"
              required
              className="form-control"
              name="duration"
              value={duration}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label>Date: </label>
            <div>
            <DatePicker selected={date} onChange={this.onChangeDate} />
            </div>
          </div>
          <div className="form-group">            
            <input
              type="submit"              
              className="btn btn-primary"              
              value="Edit Exercise Log"              
            />
          </div>
        </form>
      </div>
    );
  }
}
