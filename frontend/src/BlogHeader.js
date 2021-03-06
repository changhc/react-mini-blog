import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import commonStyle from './style/Common.css';

const BlogHeader = props => (
  <div>
    <h1 className={commonStyle.blogName}><Link to="/">ChangHC&apos;s blog</Link></h1>
    <div className={`${commonStyle.button} ${commonStyle.newPost}`} onClick={() => props.newPost()}>New Post</div>
  </div>
);

BlogHeader.propTypes = {
  newPost: PropTypes.func.isRequired,
};

export default BlogHeader;
