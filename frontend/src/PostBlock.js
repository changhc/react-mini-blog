import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimeBlock from './TimeBlock';
import style from './style/PostBlock.css';

const PostBlock = props => (
  <div className={style.block}>
    <div className={style.title}><Link to={`/post/${props.postId}`}>{props.title}</Link></div>
    <TimeBlock timestamp={props.timestamp} />
  </div>
);


PostBlock.propTypes = {
  title: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
};

export default PostBlock;
