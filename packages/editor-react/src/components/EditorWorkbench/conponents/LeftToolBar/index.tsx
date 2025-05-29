import {
  FC,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { WorkBenchContext } from '../..';
import { Extension } from '@peeto/extension';

export interface LeftToolBarRenderProps {
  customRef?: MutableRefObject<LeftToolBarRef | undefined>;
}

export interface LeftToolBarRef {
  onActive: (k: Extension['name']) => void;
}

const Index: FC<LeftToolBarRenderProps> = ({ customRef }) => {
  const { editorRef: _editorRef, reloadFlag } = useContext(WorkBenchContext);
  const editorRef = useRef(_editorRef?.current);
  editorRef.current = _editorRef?.current;
  const [curName, setCurName] = useState<string>();
  const panelRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<
    {
      extension: Extension;
      acvitityBarIcon: HTMLElement;
    }[]
  >([]);
  useEffect(() => {
    if (!reloadFlag) {
      return;
    }
    const li: typeof list = [];
    editorRef?.current?.extensionMap?.values().forEach((c) => {
      const acvitityBarIcon = c.getAcvitityBarIcon();
      if (acvitityBarIcon) {
        li.push({
          extension: c,
          acvitityBarIcon,
        });
      }
    });
    setList(li);
  }, [reloadFlag]);

  const onClickIcon = useCallback<(k?: Extension['name']) => void>((k) => {
    setCurName(k);
  }, []);
  const onClickIconRef = useRef(onClickIcon);
  onClickIconRef.current = onClickIcon;

  useEffect(() => {
    if (!curName) {
      return;
    }
    if (!panelRef.current) {
      return;
    }
    const ex = editorRef.current?.getExtensionByName(curName);
    const dom = ex?.getPanelContainer();
    if (!ex || !dom) {
      return;
    }
    // 清空panel的dom
    while (panelRef.current?.firstChild) {
      panelRef.current.removeChild(panelRef.current.firstChild);
    }
    panelRef.current.appendChild(dom);
    ex.handlePanelMounted();
  }, [curName]);

  if (customRef?.current) {
    customRef.current.onActive = (k) => {
      setCurName(k);
    };
  }

  return (
    <div
      className="peeto-workbench-left-tool-bar"
      // style={{
      //   width: siderWidth,
      // }}
    >
      <div className="peeto-workbench-left-tool-bar-icons">
        {list.map(({ extension, acvitityBarIcon }) => {
          return (
            <div
              ref={(r: HTMLDivElement) => {
                if (r) {
                  r.innerHTML = '';
                  r.appendChild(acvitityBarIcon);
                }
              }}
              key={extension.getName()}
              onClick={() => {
                const name = extension.getName();
                onClickIcon(name === curName ? undefined : name);
              }}
            />
          );
        })}
      </div>

      {curName && (
        <div
          className="peeto-workbench-left-tool-bar-panel"
          ref={panelRef}
          onClick={(e) => {
            e.stopPropagation();
            // 不能阻止默认点击，否则panel里面的Radio需要精准点击圆圈正中间才能触发onChange
            // e.preventDefault();
          }}
        />
      )}

      {/* <div
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
              <PluginRender key={item.config.name} {...item} />
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Index;
