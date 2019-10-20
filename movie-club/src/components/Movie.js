import React, { Component } from 'react';
import { Col, Row, Button } from 'reactstrap';
export default class Movie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookdetails: {}
    };
  }
  componentDidMount() {
    if (!localStorage.recommendation_login) {
      this.props.history.push('/');
    }
    console.log('this.props', this.props);
    if (this.props.location.state.data) {
      this.setState({ bookdetails: this.props.location.state.data });
    } else {
      this.props.history.push('/');
    }
  }
  render() {
    let content = '';

    if (this.state.bookdetails && this.state.bookdetails.title) {
      content = (
        <Row>
          <Col>
            <Row>
              <Col>
                <Row className="py-5 mb-5">
                  <Col md="6" xs="6" xm="6">
                    <img
                      style={{ width: '20em', height: '25em' }}
                      src={'http://image.tmdb.org/t/p/w342/' + this.state.bookdetails.src}
                    ></img>
                  </Col>
                  <Col md="6" xs="6" xm="6">
                    <Row>
                      <Col>
                        <h1>{this.state.bookdetails.title}</h1>
                      </Col>
                    </Row>
                    <Row>
                      <Col>Runtime : {this.state.bookdetails.runtime}</Col>
                    </Row>
                    <Row>
                      <Col>Release Data : {this.state.bookdetails.release_date}</Col>
                    </Row>
                    <Row>
                      <Col>Vote Average : {this.state.bookdetails.vote_average}</Col>
                    </Row>
                    {/* <Row><Col>{this.state.bookdetails.src}</Col></Row> */}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Button
                onClick={() => {
                  this.props.history.push('/');
                }}
              >
                Go Back
              </Button>
            </Row>
          </Col>
        </Row>
      );
    }
    return <div>{content}</div>;
  }
}
