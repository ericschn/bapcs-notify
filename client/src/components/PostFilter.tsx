import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function PostFilter({ currentFilter }) {
  const filters = ['cpu', 'gpu', 'ram', 'ssd-m2', 'ssd-sata', 'hdd', 'monitor', 'expired'];
  let links = [];

  for (let filter of filters) {
    links.push(
      <Link
        to={`/new/${filter}`}
        className={filter === currentFilter ? 'selected-filter' : ''} key={filter}
      >
        {filter}
      </Link>
    );
  }

  return (
    <div className="post-filter">
      <Link to="/new" className={!currentFilter ? 'selected-filter' : ''}>all</Link>
      {links}
    </div>
  );
}
