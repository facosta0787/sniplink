interface ICreateLinkParams {
  shorten: string;
  alias?: string;
}

export async function createLink({ shorten, alias }: ICreateLinkParams): Promise<any> {
  const response = await fetch('/api/v2/link', {
    headers: new Headers({
      'Content-type': 'application/json',
    }),
    method: 'post',
    body: JSON.stringify({ link: shorten, alias }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export interface ILink {
  id: string;
  hash: string;
  link: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAllLinks(): Promise<ILink[]> {
  const response = await fetch('/api/v2/link', {
    headers: new Headers({
      'Content-type': 'application/json',
    }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error.message);
  }
  const data = await response.json();
  return data.links;
}
