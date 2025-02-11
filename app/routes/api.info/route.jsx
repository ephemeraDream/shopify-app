import { json } from '@remix-run/node';

export const loader = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  return json({
    result: 'success',
    data: `我是项目A，你请求了我的接口，参数是${params}`,
  });
};
