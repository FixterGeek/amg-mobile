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

export const postPublication = (publicationPayload, userToken) => {
  const formData = new FormData();
  formData.append('user', publicationPayload.user);
  if (publicationPayload.text) formData.append('text', publicationPayload.text);
  publicationPayload.files.map(f => formData.append('images', { uri: f.uri, type: `${f.type}/${f.uri.split('.').pop()}`, name: f.uri.split('/').pop() }))

  return axios.post(APIURL, formData, {
    headers: {
      Authorization: userToken,
      "Content-Type": "multipart/form-data",
    },
  }).then(({ data }) => data);
}
