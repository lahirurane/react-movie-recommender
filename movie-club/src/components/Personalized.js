import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
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
  }

  componentDidMount() {
    console.log(
      'localStorage.movie_login ',
      localStorage.movie_login,
      localStorage.movie_login && localStorage.movie_login !== ''
    );
    if (!localStorage.recommendation_login) {
      this.props.history.push('/');
    }
    this.getFilms();
  }

  getFilms() {
    this.setState({ isLoading: true });
    axios
      .get(`/api/recommendation-engine/get-top-films`)
      .then(res => {
        this.setState({ filmlist: res.data.data, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log('Error in getting the film list');
      });
  }

  render() {
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
        <Row className="py-5">
          <h2 className="center">Movie Recommendation</h2>
        </Row>
        <Row className="pb-5">
          <h5 className="center">Your Films</h5>
        </Row>
        {content}
      </div>
    );
  }
}
