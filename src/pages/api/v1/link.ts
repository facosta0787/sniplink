// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'src/config/env';
import { uid } from 'src/utils/uid-generator';
import airtable from 'src/lib/airtable';
import Router from 'src/lib/router';
import { prisma } from 'src/lib/db';

const api = airtable();
const router = Router();
const linkDomain = config.LINK_DOMAIN;

router.get(async function (req: NextApiRequest, res: NextApiResponse) {
  const { alias } = req.query;
  try {
    const { data } = await api.getLinks({
      filterByFormula: `FIND("${alias}", {alias})`,
    });
    res.json(data.records);
  } catch (err) {
    res.status(400).json({ message: 'Unexpected Error' });
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

  if (alias !== '') {
    try {
      const { data } = await api.getLinks({
        filterByFormula: `FIND("${alias}", {alias})`,
      });
      if (data.records.length > 0)
        throw {
          error: {
            status: 'Bad Request',
            message: `Alias ${alias} already exists`,
          },
        };
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  try {
    const { data } = await api.addLink({
      uid: uid(),
      link,
      alias,
    });
    const { uid: linkUid } = data.records[0].fields;

    res.status(201).json({
      data: {
        link: `${linkDomain}/${alias.trim() ? alias : linkUid}`,
      },
    });
  } catch (err) {
    return res.status(400).json({ message: 'Unexpected Error' });
  }
});

export default router;
