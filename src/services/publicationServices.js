import axios from 'axios';

import url from './url';

const APIURL = `${url}/publications`;

export const getFeedPublicatios = (token) => {
  return axios.get(APIURL, {
    headers: {
      Authorization: token,
    },
  }).then(({ data }) => data);
};

export const getUserPublications = (userId, token) => {
  return axios.get(`${APIURL}?query={"user":"${userId}"}`, {
    headers: {
      Authorization: token,
    },
  }).then(({ data }) => data);
};
