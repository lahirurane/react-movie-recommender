import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row, Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';

export default class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {},
      isLoading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnchange = this.handleOnchange.bind(this);
    this.validateInput = this.validateInput.bind(this);
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

    if (this.state.email !== 'user1') {
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

  render() {
    let login = (
      <Container className="App">
        <h2>Sign In</h2>
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
    return (
      <Row>
        <Col md="12">
          <Row>
            <Col>
              <h1>Movie Club</h1>
            </Col>
          </Row>
          <Row>{login}</Row>
          <Row>{personalized}</Row>
        </Col>
      </Row>
    );
  }
}
