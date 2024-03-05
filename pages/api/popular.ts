import { ConsumetAPI } from '../../lib/api';
import axios from 'axios';
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { URLSearchParams } from 'url';

const popular: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { page, perPage } = req.query;
    const urlSearchParams = new URLSearchParams();

    if (page) urlSearchParams.append('page', page as string);
    if (perPage) urlSearchParams.append('perPage', perPage as string);

    const url = `${ConsumetAPI}/popular?${urlSearchParams.toString()}`;
    const response = await axios.get(`${url}`);
    const result = response.data;

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error.',
    });
  }
};

export default popular;
