import React from 'react';
import PropTypes from 'prop-types';
import style from './style/TimeBlock.css';

const TimeBlock = props => (
  <div className={style.time}>
    <i className={`fa fa-clock-o ${style.clock}`} aria-hidden="true" />
    <div className={style.timestring}>
      {new Date(parseInt(props.timestamp, 10)).toLocaleString()}
    </div>
  </div>
);

TimeBlock.propTypes = {
  timestamp: PropTypes.string,
};

TimeBlock.defaultProps = {
  timestamp: '',
};

export default TimeBlock;
