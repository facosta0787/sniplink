import type { NextApiRequest, NextApiResponse } from 'next'
import Router from 'src/lib/router'

const router = Router()

router.get((req: NextApiRequest, res: NextApiResponse) => {
  console.log(router)
  res.json({ message: 'it\'s Ok ' + req.method })
})

router.post((req: NextApiRequest, res: NextApiResponse) => {
  console.log(router)
  res.json({ message: 'it\'s Ok ' + req.method })
})

export default router