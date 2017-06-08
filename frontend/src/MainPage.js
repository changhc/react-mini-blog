import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import BlogHeader from './BlogHeader';
import PostBlock from './PostBlock';
import remoteUrl from './settings';
import style from './style/MainPage.css';
import commonStyle from './style/Common.css';

class MainPage extends Component {
  constructor({ match }) {
    super();
    this.state = {
      pageNo: match.params.pageNo === undefined ? 0 : match.params.pageNo,
      posts: [],
    };
  }

  componentDidMount() {
    window.fetch(`${remoteUrl}/api/page/${this.state.pageNo}`, {
      method: 'GET',
      mode: 'cors',
      headers: { Accept: 'application/json' },
    }).then((res) => {
      if (res.status >= 300) {
        throw new Error();
      }
      return res.json();
    }).then((body) => {
      this.setState({ next: body.next, posts: body.posts });
    }).catch(err => console.error(err));
  }

  render() {
    const newerButton = (this.state.pageNo === 0)
      ? null
      : (
        <div className={style.buttonLeft} href={this.state.pageNo === 1 ? '/' : `/page/${this.state.pageNo - 1}`}>
          ←Newer
        </div>
      );
    const olderButton = (this.state.next)
      ? (
        <div className={style.buttonRight} href={`/page/${this.state.pageNo + 1}`}>
          Older→
        </div>
      )
      : null;
    return (
      <div className={commonStyle.main}>
        <BlogHeader newPost={() => this.props.history.replace('/new-post')} />
        <div className={style.posts}>
          {this.state.posts.map(item =>
            <PostBlock
              key={item.create_time}
              postId={item.id}
              timestamp={item.create_time}
              title={item.title}
            />,
          )}
        </div>
        <div className={style.buttons}>
          {newerButton}
          {olderButton}
        </div>
      </div>
    );
  }
}

MainPage.PropTypes = {
  history: PropTypes.shape(Route.history).isRequired,
};

export default MainPage;
