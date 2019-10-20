let user_rating = [
  {
    USER_ID: 1,
    MOVIE_ID: 1771,
    RATING: 4,
    TIMESTAMP: 1260759144
  },
  {
    USER_ID: 1,
    MOVIE_ID: 47369,
    RATING: 3.8,
    TIMESTAMP: 1260759179
  },
  {
    USER_ID: 1,
    MOVIE_ID: 12110,
    RATING: 2,
    TIMESTAMP: 1260759182
  },
  {
    USER_ID: 1,
    MOVIE_ID: 755,
    RATING: 2.5,
    TIMESTAMP: 1260759185
  },
  {
    USER_ID: 1,
    MOVIE_ID: 28387,
    RATING: 4.5,
    TIMESTAMP: 1260759205
  },
  {
    USER_ID: 1,
    MOVIE_ID: 862,
    RATING: 4.7,
    TIMESTAMP: 1260759151
  },
  {
    USER_ID: 1,
    MOVIE_ID: 949,
    RATING: 3.2,
    TIMESTAMP: 1260759187
  },
  {
    USER_ID: 1,
    MOVIE_ID: 9091,
    RATING: 3.1,
    TIMESTAMP: 1260759148
  },
  {
    USER_ID: 1,
    MOVIE_ID: 31357,
    RATING: 1,
    TIMESTAMP: 1260759125
  },
  {
    USER_ID: 1,
    MOVIE_ID: 45325,
    RATING: 1.4,
    TIMESTAMP: 1260759131
  }
];

const getUserRatings = user => {
  let resultReturn = [];
  user_rating.sort((a, b) => {
    return b.TIMESTAMP - a.TIMESTAMP;
  });
  user_rating.map(data => {
    if (resultReturn.length < 5) {
      resultReturn.push(data.MOVIE_ID);
    }
  });
  return resultReturn;
};

const saveUserRating = data => {
  user_rating.push(data);
};

const getRatingForMovie = id => {
  let index = user_rating.map(e => e.MOVIE_ID).indexOf(id);
  if (index < 0) {
    return 0;
  } else {
    return user_rating[index].RATING;
  }
};

export { saveUserRating, getUserRatings, getRatingForMovie };
