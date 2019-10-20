import React, { Component, lazy, Suspense } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { Col, Row } from 'reactstrap';

class FilmList extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const filmList = this.props.books;
    return (
      <Row>
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {filmList.map((item, index) => {
            return (
              <Link
                to={{
                  pathname: '/movie',
                  state: {
                    data: item
                  }
                }}
                style={{ fontWeight: 700, color: '#0c2461' }}
                key={item.id}
                className="col-xs-4 col-sm-4 col-md-3 col-lg-2 py-2"
              >
                <Row className="px-2">
                  <img
                    style={{ width: '100%', height: 'auto' }}
                    src={'http://image.tmdb.org/t/p/w342/' + item.src}
                  ></img>
                </Row>
                <Row className="text-center" style={{ color: '#ffffff' }}>
                  <span className="col-md-12 py-2"> {item.title}</span>
                </Row>
              </Link>
            );
          })}
        </div>
      </Row>
    );
  }
}

export default FilmList;
