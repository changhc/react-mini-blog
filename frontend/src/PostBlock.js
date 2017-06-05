import React from 'react';
import PropTypes from 'prop-types';
import style from './style/PostBlock.css';

const PostBlock = props => (
  <div className={style.block}>
    <div className={style.title}><a href={`/post/${props.postId}`}>{props.title}</a></div>
    <div className={style.time}>
      {new Date(parseInt(props.timestamp, 10)).toLocaleString()}
    </div>
  </div>
);


PostBlock.propTypes = {
  title: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
};

export default PostBlock;
