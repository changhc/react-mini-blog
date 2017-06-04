import React from 'react';
import PropTypes from 'prop-types';
import style from './style/PostBlock.css';

const PostBlock = props => (
  <div className={style.block}>
    <h2 href={`/post/${props.postId}`}>{props.title}</h2>
    <div className={style.time}>
      {new Date(props.timestamp).toLocaleString()}
    </div>
  </div>
);

PostBlock.propTypes = {
  title: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  postId: PropTypes.string.isRequired,
};

export default PostBlock;
