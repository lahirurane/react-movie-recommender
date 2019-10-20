
import pandas as pd
import numpy as np
import seaborn as sns
from scipy import stats
from ast import literal_eval
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from nltk.stem.snowball import SnowballStemmer
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import wordnet
from surprise import Reader, Dataset, SVD
from flask import Flask, make_response
from json import dumps
from flask_cors import CORS

import warnings
warnings.simplefilter('ignore')


# print(md.head())


def get_top():
    md = pd. read_csv('./Data_CSV/movies_metadata.csv')
    md['genres'] = md['genres'].fillna('[]').apply(literal_eval).apply(
        lambda x: [i['name'] for i in x] if isinstance(x, list) else [])

    vote_counts = md[md['vote_count'].notnull()]['vote_count'].astype('int')
    vote_averages = md[md['vote_average'].notnull()
                       ]['vote_average'].astype('int')
    C = vote_averages.mean()

    m = vote_counts.quantile(0.95)

    md['year'] = pd.to_datetime(md['release_date'], errors='coerce').apply(
        lambda x: str(x).split('-')[0] if x != np.nan else np.nan)

    qualified = md[(md['vote_count'] >= m) & (md['vote_count'].notnull()) & (md['vote_average'].notnull())][[
        'title', 'year', 'vote_count', 'vote_average', 'popularity', 'genres', 'release_date', 'runtime', 'poster_path', 'id']]
    qualified['vote_count'] = qualified['vote_count'].astype('int')
    qualified['vote_average'] = qualified['vote_average'].astype('int')
    qualified.shape

    def weighted_rating(x):
        v = x['vote_count']
        R = x['vote_average']
        return (v/(v+m) * R) + (m/(m+v) * C)

    qualified['wr'] = qualified.apply(weighted_rating, axis=1)

    qualified = qualified.sort_values('wr', ascending=False).head(250)

    # print(qualified.head(15))
    return qualified


def get_for_genre(genre):
    s = md.apply(lambda x: pd.Series(x['genres']),
                 axis=1).stack().reset_index(level=1, drop=True)
    s.name = 'genre'
    gen_md = md.drop('genres', axis=1).join(s)

    def build_chart(genre, percentile=0.85):
        df = gen_md[gen_md['genre'] == genre]
        vote_counts = df[df['vote_count'].notnull()
                         ]['vote_count'].astype('int')
        vote_averages = df[df['vote_average'].notnull()
                           ]['vote_average'].astype('int')
        C = vote_averages.mean()
        m = vote_counts.quantile(percentile)

        qualified = df[(df['vote_count'] >= m) & (df['vote_count'].notnull()) & (
            df['vote_average'].notnull())][['title', 'year', 'vote_count', 'vote_average', 'popularity']]
        qualified['vote_count'] = qualified['vote_count'].astype('int')
        qualified['vote_average'] = qualified['vote_average'].astype('int')

        qualified['wr'] = qualified.apply(lambda x: (
            x['vote_count']/(x['vote_count']+m) * x['vote_average']) + (m/(m+x['vote_count']) * C), axis=1)
        qualified = qualified.sort_values('wr', ascending=False).head(250)

        return qualified

    return build_chart(genre)


def get_for_movie(id):
    # print("get get")
    md = pd. read_csv('./Data_CSV/movies_metadata.csv')
    links_small = pd.read_csv('./Data_CSV/links_small.csv')
    links_small = links_small[links_small['tmdbId'].notnull()
                              ]['tmdbId'].astype('int')
    md = md.drop([19730, 29503, 35587])
    title = md.loc[md.id == id, 'title'].values[0]
    # print("title", title)
    md['id'] = md['id'].astype('int')

    smd = md[md['id'].isin(links_small)]

    smd['tagline'] = smd['tagline'].fillna('')
    smd['description'] = smd['overview'] + smd['tagline']
    smd['description'] = smd['description'].fillna('')

    tf = TfidfVectorizer(analyzer='word', ngram_range=(1, 2),
                         min_df=0, stop_words='english')
    tfidf_matrix = tf.fit_transform(smd['description'])

    tfidf_matrix.shape

    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    cosine_sim[0]

    smd = smd.reset_index()
    titles = smd['title']
    indices = pd.Series(smd.index, index=smd['title'])

    def get_recommendations(title):
        try:
            idx = indices[title]
            if(idx):
                sim_scores = list(enumerate(cosine_sim[idx]))
                sim_scores = sorted(
                    sim_scores, key=lambda x: x[1], reverse=True)
                sim_scores = sim_scores[1:31]
                movie_indices = [i[0] for i in sim_scores]
                returnResult = smd.iloc[movie_indices]
                return returnResult
            else:
                return pd.DataFrame()
        except Exception as e:
            print repr(e)
            return pd.DataFrame()

    return get_recommendations(title)

# finaldf = pd.DataFrame(columns=['adult','belongs_to_collection','budget','genres','homepage','id','imdb_id','original_language','original_title','overview','popularity','poster_path','production_companies','production_countries','release_date','revenue','runtime','spoken_languages','status','tagline','title','video','vote_average','vote_count'])


# print('get_top')
# get_top()
# print('get_for_movie')
app = Flask(__name__)
cors = CORS(app)


@app.route('/api_get_top')
def api_get_top():
    results = get_top()[['id', 'title', 'poster_path',
                         'genres', 'runtime', 'release_date', 'vote_average']]
    return make_response(dumps(results.set_index('id').T.to_dict('list')))


@app.route('/api_get_for_movie/<movielist>')
def api_get_for_movie(movielist=None, limit=None):
    # results = movielist
    finaldf = pd.DataFrame(columns=[
        'id', 'title', 'poster_path', 'genres', 'runtime', 'release_date', 'vote_average'])

    ls = movielist.strip('[]').replace('"', '').replace(' ', '').split(',')
    for movieID in ls:
        recomsList = get_for_movie(
            movieID)
        # print(recoms.head(5), type(recoms))
        if(recomsList.empty == False):
            recoms = recomsList[['id', 'title', 'poster_path',
                                 'genres', 'runtime', 'release_date', 'vote_average']]
            finaldf = finaldf.append(recoms, ignore_index=True)

    # print(finaldf.head(20))

    return make_response(dumps(finaldf.set_index('id').T.to_dict('list')))


# df.set_index('ID').T.to_dict('list')
# print("results", dumps(results))
# return make_response(dumps(results))


if __name__ == '__main__':
    app.run('localhost', 5000)
