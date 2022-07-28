import axios from 'axios';
import { getToken } from '../retraced/projects';

const getGroups = async (
  id: string,
  token: string,
  projectId = 'aceb333136834868b4a9d7a523260137',
  environmentId = 'e1426c14c29345c68d303d8b784d2a04'
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      query: {
        length: 10,
        offset: 0,
      },
    });

    const config = {
      method: 'get',
      url: `${process.env.RETRACED_HOST}/admin/v1/project/${projectId}/groups?environment_id=${environmentId}`,
      headers: {
        Authorization: `id=${id} token=${token}`,
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export default async function handler(req, res) {
  const token = await getToken();
  const groups = await getGroups(token.id, token.token);
  res.status(200).json(groups.groups);
}