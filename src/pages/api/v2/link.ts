// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'src/config/env';
import { uid } from 'src/utils/uid-generator';
import Router from 'src/lib/router';
import db from 'src/lib/db';

const router = Router();
const linkDomain = config.LINK_DOMAIN;

router.get(async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const links = await db.conn.link.findMany();

    return res.status(201).json({
      data: {
        links,
      },
    });
  } catch (err) {
    console.error('api/v2/links:error ', err);
    return res.status(400).json({ message: 'Unexpected Error' });
  }
});

router.post(async function (req: NextApiRequest, res: NextApiResponse) {
  const { link, alias } = req.body;
  if (!link) {
    return res.status(400).json({
      error: {
        status: 'Bad Request',
        message: 'Missing link param',
      },
    });
  }

  if (alias && alias !== '') {
    try {
      const foundLink = await db.link.find({
        alias,
      });
      if (foundLink) {
        throw {
          error: {
            status: 'Bad Request',
            message: `Alias ${alias} already exists`,
          },
          data: foundLink,
        };
      }
    } catch (err) {
      console.error('api/v2/links:error ', err);
      res.status(400).json(err);
    }
  }

  const newLink = alias ? { hash: uid(), link, alias } : { hash: uid(), link };

  try {
    const created = await db.link.create(newLink);

    return res.status(201).json({
      data: {
        link: `${linkDomain}/${created.alias?.trim() ? created.alias : created.hash}`,
      },
    });
  } catch (err) {
    console.error('api/v2/links:error ', err);
    return res.status(400).json({ message: 'Unexpected Error' });
  }
});

export default router;
