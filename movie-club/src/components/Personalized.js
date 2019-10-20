import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import axios from 'axios';
import FilmList from './FilmList';

export default class Personalized extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filmlist: [],
      isLoading: false
    };
    this.getFilms = this.getFilms.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount() {
    if (!localStorage.recommendation_login) {
      this.props.history.push('/');
    }
    this.getFilms();
  }

  getFilms() {
    this.setState({ isLoading: true });
    axios
      .get(`/api_get_for_movie/[862,8844]`)
      .then(res => {
        let list = [];
        console.log(res.data);
        Object.keys(res.data).forEach(function(key) {
          // console.table('Key : ' + key + ', Value : ' + data[key])
          list.push({
            id: key,
            title: res.data[key][0],
            src: res.data[key][1],
            genres: res.data[key][2],
            runtime: res.data[key][3],
            release_date: res.data[key][4],
            vote_average: res.data[key][5]
          });
        });
        this.setState({ filmlist: list, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log('Error in getting the film list');
      });
  }

  onLogout() {
    alert('Loggin out from your account');
    localStorage.removeItem('movie_login');
    this.props.history.push('/');
  }

  render() {
    console.log('result', this.state.filmlist);
    let content = '';

    if (this.state.isLoading) {
      content = (
        <Row>
          <Col className="text-center">
            <div class="spinner-border text-secondary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </Col>
        </Row>
      );
    } else {
      content = (
        <Row>
          <Col className="mx-4">
            <FilmList books={this.state.filmlist} />
          </Col>
        </Row>
      );
    }
    return (
      <div className="animated fadeIn">
        <Row>
          <Button onClick={this.onLogout}>Logout</Button>
        </Row>
        <Col>
          <Row className="py-5">
            <h2 className="center">Movie Recommendation</h2>
          </Row>
          <Row className="pb-5">
            <h5 className="center">Your Films</h5>
          </Row>
          {content}
        </Col>
      </div>
    );
  }
}
