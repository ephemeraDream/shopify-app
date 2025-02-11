import { json } from '@remix-run/node';

export const loader = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  return json({
    result: 'success',
    data: `你请求了本地接口，参数是${params}`,
  });
};
