import { Card, Layout, Page, BlockStack } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import { useEffect } from 'react';
import { $getLocalInfo, $getAnotherInfo } from 'Apis/example';

export const loader = async () => {
  // loader中调用自身项目写好的接口
  const init1 = async () => {
    const [error, data] = await $getLocalInfo({ query: '1' });
    if (!error) {
      console.log('Loader中调用自身项目的接口成功', data);
    }
  };

  // loader中调用远程接口
  const init2 = async () => {
    const [error, data] = await $getAnotherInfo({ query: '2' });
    if (!error) {
      console.log('loader中调用远程接口成功', data);
    }
  };

  await init1();
  await init2();
  return null;
};

export default function RequestExamplePage() {
  // 组件中调用自身项目写好的接口
  const init1 = async () => {
    const [error, data] = await $getLocalInfo({ query: '1' });
    if (!error) {
      console.log('组件中调用自身项目的接口成功', data);
    }
  };
  
  // 组件中调用远程接口
  const init2 = async () => {
    const [error, data] = await $getAnotherInfo({ query: '2' });
    if (!error) {
      console.log('组件中调用远程接口成功', data);
    }
  };

  useEffect(() => {
    init1();
    init2();
  }, []);

  return (
    <Page>
      <TitleBar title="请求封装示例页面" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">请在开发终端和浏览器终端查看打印内容</BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
