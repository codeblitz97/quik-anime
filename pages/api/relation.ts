import { AnifyAPI } from '@/lib/api';
import axios from 'axios';
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

export const config = {
  api: {
    responseLimit: false,
  },
};

const relations: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const id = req.query.id;
    const response = await axios.get(`${AnifyAPI}/relations/${id ?? '20'}`);
    const result = response.data;
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error.',
    });
  }
};

export default relations;
