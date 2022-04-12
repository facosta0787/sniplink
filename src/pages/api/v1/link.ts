// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { uid } from 'src/utils/uid-generator';
import airtable from 'src/lib/airtable';
import Router from 'src/lib/router';

const api = airtable();
const router = Router();
const linkDomain = process.env.LINK_DOMAIN;

router.get(async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await api.getLinks();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: 'Unexpected Error' });
  }
});

router.post(async function (req: NextApiRequest, res: NextApiResponse) {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({
      error: {
        status: 'Bad Request',
        message: 'Missing link param',
      },
    });
  }

  try {
    const { data } = await api.addLink({
      uid: uid(),
      link,
    });
    const { uid: linkUid } = data.records[0].fields;

    res.status(201).json({
      data: {
        link: `${linkDomain}/${linkUid}`,
      },
    });
  } catch (err) {
    return res.status(400).json({ message: 'Unexpected Error' });
  }
});

export default router;
