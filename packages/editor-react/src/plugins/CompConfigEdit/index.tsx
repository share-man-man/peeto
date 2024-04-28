import { InjectPluginCompProps } from '@peeto/editor';
import { Card } from 'antd';
import { useEffect, useRef } from 'react';
import ComponentPicker from './utils/component-pick';
import { SIMILATOR_COMP_DOM_MAP_CHANGE_EVENT } from '../SimilatorPlugin';

export const START_PICK_EVENT = '__peeto_start_pick_event';

// 配置插件
// 监听当前选中组件id
// 通过组件id获取schema中组件信息
// 通过组件信息映射关系，获取配置表单json
// 通过setter映射，渲染配置表单json
const Index = ({
  subscribeEvent,
  compDomMapChangeEventName = SIMILATOR_COMP_DOM_MAP_CHANGE_EVENT,
  startPickEventName = START_PICK_EVENT,
}: InjectPluginCompProps & {
  /**
   * 事件名:映射关系修改
   */
  compDomMapChangeEventName?: string;
  /**
   * 事件名:启动监听用户选择
   */
  startPickEventName?: string;
}) => {
  const componentPickerRef = useRef(
    new ComponentPicker({
      onCheckComp: (compList) => {
        console.log(111, compList);
        // TODO 告诉设置器，配置对象
        // 告诉配置器插件，当前选中的组件
      },
    })
  );

  useEffect(() => {
    subscribeEvent([
      {
        name: compDomMapChangeEventName,
        run: (v) => {
          componentPickerRef.current.updateMap(v);
        },
      },
      //   {
      //     name: configChangeEventName,
      //     run: (v) => {
      //       //   setConfig({
      //       //     ...v,
      //       //   });
      //     },
      //   },
      {
        name: startPickEventName,
        run: () => {
          const picker = componentPickerRef.current;
          picker.startSelecting();
        },
      },
    ]);
  }, [compDomMapChangeEventName, startPickEventName, subscribeEvent]);

  // 卸载后停止监听
  useEffect(() => {
    const picker = componentPickerRef.current;
    // picker.startSelecting();
    return () => {
      picker.stopSelecting();
    };
  }, []);

  return <Card title="111">aa</Card>;
};

export default Index;
