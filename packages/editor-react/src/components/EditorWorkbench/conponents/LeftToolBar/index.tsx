import { PushpinOutlined } from '@ant-design/icons';
import { Layout, Row, Space } from 'antd';
import { LeftToolBarPluginItemProps } from '../../type';
import { useMemo, useState } from 'react';
import PluginRender from '../../../PluginRender';

// TODO
const siderStyle: React.CSSProperties = {
  fontSize: 28,
  textAlign: 'center',
  // lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#1677ff',
};

export interface LeftToolBarRenderProps {
  list: LeftToolBarPluginItemProps[];
}

/**
 * 默认icon列表宽度
 */
const defaultWidth = 28;
/**
 * 默认面板宽度
 */
const defaultPannelWidth = 300;

const Index = ({ list }: LeftToolBarRenderProps) => {
  const [fixPannel, setFixPannel] = useState(false);
  const [curName, setCurName] = useState<
    LeftToolBarPluginItemProps['name'] | null
  >(null);
  //   当前选中插件
  const curPlugin = useMemo(() => {
    return list.find((i) => i.name === curName);
  }, [curName, list]);
  const curPanneWidth = useMemo(() => {
    if (!curPlugin) {
      return 0;
    }
    return curPlugin.pannelWidth ?? defaultPannelWidth;
  }, [curPlugin]);
  const siderWidth = useMemo<number>(() => {
    return defaultWidth + (fixPannel ? 0 : curPanneWidth);
  }, [curPanneWidth, fixPannel]);

  return (
    <Layout.Sider width={siderWidth} style={siderStyle}>
      <Row
        style={{
          fontSize: 28,
          flexWrap: 'nowrap',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <Space direction="vertical">
          {list.map((t) => (
            <div
              key={t.name}
              onClick={() => {
                if (curName === t.name) {
                  setCurName(null);
                } else {
                  setCurName(t.name);
                }
              }}
            >
              {t.icon}
            </div>
          ))}
        </Space>

        <div
          style={{
            width: curPanneWidth,
            position: fixPannel ? 'absolute' : 'relative',
            transform: fixPannel ? `translateX(${defaultWidth}px)` : '',
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'auto',
            }}
          >
            <PushpinOutlined
              onClick={() => {
                setFixPannel(!fixPannel);
              }}
            />
            <div>
              {list.map((item) => (
                <PluginRender
                  key={item.name}
                  item={item}
                  visible={curName === item.name}
                />
              ))}
            </div>
          </div>
        </div>
      </Row>
    </Layout.Sider>
  );
};

export default Index;
