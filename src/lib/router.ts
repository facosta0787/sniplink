import type { NextApiRequest, NextApiResponse } from 'next';

type IHandle = {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => void;
};

export default function Router() {
  const handle: IHandle = {};

  async function router(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<void> {
    switch (req.method) {
      case 'GET':
        if (router.handle.get) {
          await router.handle.get(req, res);
          break;
        }
      case 'POST':
        if (router.handle.post) {
          await router.handle.post(req, res);
          break;
        }
      case 'DELETE':
        if (router.handle.delete) {
          await router.handle.delete(req, res);
          break;
        }
      case 'PUT':
        if (router.handle.put) {
          await router.handle.put(req, res);
          break;
        }
      case 'PATCH':
        if (router.handle.patch) {
          await router.handle.patch(req, res);
          break;
        }
      default:
        res.status(405).json({
          status: 'Method Not Allowed',
          message: `Method ${req.method} not allowed`,
        });
    }
  }

  router.handle = handle;

  router.get = function (
    cb: (req: NextApiRequest, res: NextApiResponse) => any,
  ) {
    router.handle.get = cb;
  };

  router.post = function (
    cb: (req: NextApiRequest, res: NextApiResponse) => void,
  ) {
    router.handle.post = cb;
  };

  router.delete = function (
    cb: (req: NextApiRequest, res: NextApiResponse) => void,
  ) {
    router.handle.delete = cb;
  };

  router.put = function (
    cb: (req: NextApiRequest, res: NextApiResponse) => void,
  ) {
    router.handle.put = cb;
  };

  router.patch = function (
    cb: (req: NextApiRequest, res: NextApiResponse) => void,
  ) {
    router.handle.patch = cb;
  };

  return router;
}
