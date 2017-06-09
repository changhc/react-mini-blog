import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import BlogHeader from './BlogHeader';
import TimeBlock from './TimeBlock';
import style from './style/Post.css';
import commonStyle from './style/Common.css';
import remoteUrl from './settings';

class Post extends Component {
  constructor({ match }) {
    super();
    this.state = {
      postId: match.params.postId,
    };
    this.parseTime = this.parseTime.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  componentDidMount() {
    window.fetch(`${remoteUrl}/api/post/${this.state.postId}`, {
      method: 'GET',
      mode: 'cors',
      headers: { Accept: 'application/json' },
    }).then((res) => {
      if (res.status > 299) {
        this.props.history.replace('/404');
      }
      return res.json();
    }).then((body) => {
      this.setState(body);
    }).catch(err => console.error(err));
  }

  parseTime() {
    return new Date(parseInt(this.state.create_time, 10)).toLocaleString();
  }

  deletePost() {
    window.fetch(`${remoteUrl}/api/delete`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: this.state.postId }),
    }).then((res) => {
      if (res.status > 299) {
        throw new Error();
      }
      this.props.history.replace('/');
    }).catch(err => console.error(err));
  }

  render() {
    return (
      <div className={commonStyle.main}>
        <BlogHeader newPost={() => this.props.history.replace('/new-post')} />
        <div className={style.title}>
          <div className={style.buttons}>
            <div className={style.smallButton} onClick={() => this.props.history.replace(`/edit/${this.state.postId}`)}>Edit</div>
            <div className={style.smallButton} onClick={() => this.deletePost()}>Delete</div>
          </div>
          <div>
            {this.state.title}
          </div>
        </div>
        <TimeBlock timestamp={this.state.create_time} />
        <hr />
        <div className={style.content} dangerouslySetInnerHTML={{ __html: this.state.content }} />
      </div>
    );
  }
}

Post.propTypes = {
  history: PropTypes.shape(Route.history).isRequired,
};

export default Post;
