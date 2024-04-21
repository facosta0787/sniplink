import type { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'config/env';
import Router from 'src/lib/router';
import db from 'src/lib/db';

const router = Router();

router.post(async function (req: NextApiRequest, res: NextApiResponse) {
  const { linkId } = req.body;
  console.log('>> req.body', req.body);

  if (!linkId) {
    return res.status(400).json({
      error: {
        status: 'Bad Request',
        message: 'Missing linkId param',
      },
    });
  }

  try {
    await db.conn.analytics.create({
      data: {
        linkId,
      },
    });

    return res.status(201).json({
      ok: true,
    });
  } catch (error) {
    console.error('api/v2/analytics:error ', error);
    return res.status(400).json({ message: `Error creating analytics for linkId ${linkId}` });
  }
});

export default router;
