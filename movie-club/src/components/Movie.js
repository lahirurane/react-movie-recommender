import React, { Component } from 'react';
import { Col, Row, Button, Badge } from 'reactstrap';
import StarRatings from 'react-star-ratings';
import { saveUserRating, getRatingForMovie } from '../util/RatingHandler';
export default class Movie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookdetails: {},
      rating: 0
    };
    this.changeRating = this.changeRating.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }
  componentDidMount() {
    // if (!localStorage.movie_login) {
    //   this.props.history.push('/');
    // }
    console.log('this.props', this.props);
    if (this.props.location.state.data) {
      this.setState({ bookdetails: this.props.location.state.data });
    } else {
      this.props.history.push('/');
    }

    let rating = getRatingForMovie(this.props.location.state.data.id);
    this.setState({ rating: rating });
  }

  changeRating(newRating, name) {
    this.setState({
      rating: newRating
    });
    saveUserRating({
      USER_ID: 1,
      MOVIE_ID: this.state.bookdetails.id,
      RATING: newRating,
      TIMESTAMP: new Date().getTime()
    });
  }

  onLogout() {
    alert('Loggin out from your account');
    localStorage.removeItem('movie_login');
    this.props.history.push('/');
  }

  render() {
    let content = '';
    if (this.state.bookdetails && this.state.bookdetails.title) {
      content = (
        <Row>
          <Col>
            <Row>
              <Col style={{ background: '#0e0e0e' }} className="text-right pr-5 py-2 ">
                <div>
                  {localStorage.movie_login ? (
                    <Button className="mr-5" onClick={this.onLogout}>
                      Logout
                    </Button>
                  ) : (
                    ''
                  )}
                  <Button
                    onClick={() => {
                      this.props.history.push('/');
                    }}
                  >
                    Go Back
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="py-5">
                    <h1>MOVIE DETAILS</h1>
                  </Col>
                </Row>
                <Row className="py-5 mb-5">
                  <Col md="3">&nbsp;</Col>
                  <Col md="3" xs="3" xm="3">
                    <img
                      style={{ width: '20em', height: '25em' }}
                      src={'http://image.tmdb.org/t/p/w342/' + this.state.bookdetails.src}
                    ></img>
                  </Col>
                  <Col className="text-left" md="6" xs="6" xm="6">
                    <Row>
                      <Col className="pb-4">
                        <h1>{this.state.bookdetails.title}</h1>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pb-2">Runtime : {this.state.bookdetails.runtime}</Col>
                    </Row>
                    <Row>
                      <Col className="pb-2">
                        Release Data : {this.state.bookdetails.release_date}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pb-2">
                        Vote Average : {this.state.bookdetails.vote_average}
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Button className="btn btn-warning my-5">Watch Now</Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="py-5">
                        {localStorage.movie_login ? (
                          <StarRatings
                            rating={this.state.rating}
                            starRatedColor="blue"
                            changeRating={this.changeRating}
                            numberOfStars={5}
                            name="rating"
                            starDimension="30px"
                          />
                        ) : (
                          ''
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }
    return <div>{content}</div>;
  }
}
