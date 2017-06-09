import React from 'react';
import PropTypes from 'prop-types';
import TimeBlock from './TimeBlock';
import style from './style/PostBlock.css';

const PostBlock = props => (
  <div className={style.block}>
    <div className={style.title}><a href={`/post/${props.postId}`}>{props.title}</a></div>
    <TimeBlock timestamp={props.timestamp} />
  </div>
);


PostBlock.propTypes = {
  title: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
};

export default PostBlock;
