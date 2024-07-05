import React from 'react';

const FormattedDate = ({ timestamp }) => {
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 60);

    if (interval < 1) {
      return 'just now';
    }
    if (interval < 60) {
      return `${interval} ${interval === 1 ? 'phút' : 'phút'} trước`;
    }

    interval = Math.floor(interval / 60);
    if (interval < 24) {
      return `${interval} ${interval === 1 ? 'giờ' : 'giờ'} trước`;
    }

    interval = Math.floor(interval / 24);
    if (interval < 7) {
      return `${interval} ${interval === 1 ? 'ngày' : 'ngày'} trước`;
    }

    interval = Math.floor(interval / 7);
    if (interval < 4) {
      return `${interval} ${interval === 1 ? 'tuần' : 'tuần'} trước`;
    }

    interval = Math.floor(interval / 4);
    if (interval < 12) {
      return `${interval} ${interval === 1 ? 'tháng' : 'tháng'} trước`;
    }

    interval = Math.floor(interval / 12);
    return `${interval} ${interval === 1 ? 'năm' : 'năm'} trước`;
  };

  const relativeTime = formatRelativeTime(timestamp);

  return <span>{relativeTime}</span>;
};

export default FormattedDate;
