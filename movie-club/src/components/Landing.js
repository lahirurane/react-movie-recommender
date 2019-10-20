import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row, Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import FilmList from './FilmList';
import axios from 'axios';

export default class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {},
      filmlist: [],
      isLoading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnchange = this.handleOnchange.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.getPopular = this.getPopular.bind(this);
  }

  componentDidMount() {
    if (localStorage.movie_login && localStorage.movie_login !== '') {
      this.props.history.push('/my-page');
    }
    //TODO
    this.getPopular();
  }

  handleOnchange(event) {
    console.log('event', event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value, errors: {} });
  }

  handleSubmit() {
    if (this.validateInput()) {
      const data = {
        email: this.state.email,
        password: this.state.password
      };
      localStorage.setItem('movie_login', JSON.stringify(data));

      //Navigate
      this.props.history.push('/my-page');
    } else {
      return;
    }
  }

  validateInput() {
    let isValid = true;
    const errors = {};

    if (this.state.email === '') {
      isValid = false;
      errors.email = 'Cannot be empty';
    }

    if (this.state.email !== 'admin') {
      isValid = false;
      errors.email = 'User Not Found';
    }

    if (this.state.password === '') {
      isValid = false;
      errors.password = 'Cannot be empty';
    }

    this.setState({ errors: errors });
    return isValid;
  }

  getPopular() {
    this.setState({ isLoading: true });

    if (!localStorage.movie_p_t) {
      axios
        .get(`/api_get_top`)
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
          list.length = 50;
          this.setState({ filmlist: list, isLoading: false });

          localStorage.setItem('movie_p_t', JSON.stringify(list));
        })
        .catch(err => {
          this.setState({ isLoading: false });
          console.log('Error in getting the film list');
        });
    } else {
      this.setState({
        filmlist:
          Array.isArray(JSON.parse(localStorage.movie_p_t)) && JSON.parse(localStorage.movie_p_t),
        isLoading: false
      });
    }
  }

  render() {
    let login = (
      <Container>
        <h3>SIGN IN</h3>
        <Form className="form">
          <Col>
            <FormGroup>
              <Label>Email</Label>
              <Input
                onChange={this.handleOnchange}
                type="email"
                name="email"
                placeholder="myemail@email.com"
              />
              {this.state.errors.email && (
                <div className="col-md-12 col-xs-12 input-group invalid-feedback error-message">
                  {this.state.errors.email}
                </div>
              )}
            </FormGroup>
          </Col>

          <Col>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input
                onChange={this.handleOnchange}
                type="password"
                name="password"
                placeholder="********"
              />
              {this.state.errors.password && (
                <div className="col-md-12 col-xs-12 input-group invalid-feedback error-message">
                  {this.state.errors.password}
                </div>
              )}
            </FormGroup>
          </Col>
          <Button onClick={this.handleSubmit}>Submit</Button>
        </Form>
      </Container>
    );
    let personalized = '';
    if (this.state.isLoading) {
      personalized = (
        <Row>
          <Col className="text-center">
            <div class="spinner-border text-secondary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </Col>
        </Row>
      );
    }

    if (this.state.filmlist.length > 0) {
      personalized = (
        <Row>
          <Col>
            {' '}
            <Row className="text-left pl-5 ml-5">
              <Col> TOP ITEMS</Col>
            </Row>
            <Row className=" px-5 mx-5">
              <Col>
                {' '}
                <FilmList books={this.state.filmlist} />
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }

    return (
      <Row>
        <Col md="12">
          <Row>
            <Col style={{ background: '#0e0e0e' }} className="text-right pr-5 py-2">
              <Button style={{ visibility: 'hidden' }} onClick={this.onLogout}>
                Logout
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className="py-5">
              <h1 style={{ fontWeight: '700' }}>MOVIE CLUB</h1>
            </Col>
          </Row>
          <Row>{login}</Row>
          <Row className="mt-5">
            <Col>{personalized}</Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
