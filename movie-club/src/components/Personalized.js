import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import axios from 'axios';
import FilmList from './FilmList';
import { getUserRatings } from '../util/RatingHandler';
import StarRatings from 'react-star-ratings';

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
    if (!localStorage.movie_login) {
      this.props.history.push('/');
    }
    this.getFilms();
  }

  componentDidUpdate(prev) {
    if (prev !== this.props) {
      if (!localStorage.movie_login) {
        this.props.history.push('/');
      }
    }
  }

  getFilms() {
    this.setState({ isLoading: true });

    if (!localStorage.movie_p_r) {
      axios
        .get(`/api_get_for_movie/${getUserRatings(1)}`)
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

          localStorage.setItem('movie_p_r', JSON.stringify(list));
        })
        .catch(err => {
          this.setState({ isLoading: false });
          console.log('Error in getting the film list');
        });
    } else {
      this.setState({
        filmlist:
          Array.isArray(JSON.parse(localStorage.movie_p_r)) && JSON.parse(localStorage.movie_p_r),
        isLoading: false
      });
    }
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
          <Col style={{ background: '#0e0e0e' }} className="text-right pr-5 py-2">
            <div>
              {localStorage.movie_p_r ? (
                <Button
                  className="mr-5"
                  onClick={() => {
                    localStorage.removeItem('movie_p_r');
                    this.setState({ filmlist: [] }, this.getFilms());
                  }}
                >
                  Reload
                </Button>
              ) : (
                ''
              )}
              <Button onClick={this.onLogout}>Logout</Button>
            </div>
          </Col>
        </Row>
        <Col>
          <Row className="py-5">
            <Col>
              {' '}
              <h1 style={{ fontWeight: '700' }} className="center">
                MOVIE CLUB
              </h1>
            </Col>
          </Row>
          <Row className="pb-5">
            <Col className="text-left pl-5">
              {' '}
              <h5>PICKS FOR YOU</h5>
            </Col>
          </Row>

          {content}
        </Col>
      </div>
    );
  }
}
