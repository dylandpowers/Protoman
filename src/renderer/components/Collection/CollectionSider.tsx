import React from 'react';
import { Layout, Collapse, Modal } from 'antd';
import styled from 'styled-components';
import CollectionCell from './CollectionCell';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../models/AppState';
import NewCollectionCell from './NewCollectionCell';
import {
  createCollection,
  toggleCollections,
  selectFlow,
  deleteFlow,
  createFlow,
  closeFM,
  openFM,
} from './CollectionActions';
import GhostCollectionCell from './GhostCollectionCell';
import FlowList from './FlowList';
import { getByKey } from '../../utils/utils';
import ProtofileManager from './protofile/ProtofileManager';
import { selectColNames } from '../../redux/store';
import { validateNewCollectionName } from '../../models/Collection';

const { Panel } = Collapse;

const Sider = styled(Layout.Sider)`
  background: #fff;
  box-shadow: 1px 0 3px -0px #aaa;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
`;

const Header = styled('div')`
  text-align: center;
  width: 100%;
  flex: 0 0 auto;
  padding: 16px 0px;
`;

const Title = styled('h1')`
  user-select: none;
  margin: 0;
`;

const LeanCollapse = styled(Collapse)`
  flex: 1 1 auto;
  overflow: auto;
  height: 90%;
  border-radius: 0;
`;

export const COLLECTION_SIDER_WIDTH = 210;

const CollectionSider: React.FunctionComponent<{}> = ({}) => {
  const dispatch = useDispatch();

  const collections = useSelector((s: AppState) => s.collections);
  const openCollections = useSelector((s: AppState) => s.openCollections);
  const fmOpenCollection = useSelector((s: AppState) => s.fmOpenCollection);

  const [isCreatingCol, setIsCreatingCol] = React.useState(false);
  const showGhostCol = (): void => setIsCreatingCol(true);
  const hideGhostCol = (): void => setIsCreatingCol(false);

  function handleToggleOpen(openCollections: string[]): void {
    dispatch(toggleCollections(openCollections));
  }

  return (
    <Sider width={COLLECTION_SIDER_WIDTH} theme="light">
      <Wrapper>
        <Header>
          <Title>Collections</Title>
        </Header>
        <LeanCollapse
          activeKey={[...openCollections]}
          expandIcon={(): React.ReactNode => <span />}
          onChange={(k): void => {
            if (typeof k === 'string') {
              handleToggleOpen([k]);
            } else {
              // array of keys
              handleToggleOpen(k);
            }
          }}
        >
          {collections.map(([name]) => {
            const header = <CollectionCell collectionName={name} />;
            return (
              <Panel key={name} header={header} style={{ paddingBottom: 4 }}>
                <FlowList collectionName={name} />
              </Panel>
            );
          })}
          {isCreatingCol ? <GhostCollectionCell onCancel={hideGhostCol} /> : null}
          <NewCollectionCell onCreate={showGhostCol} />
        </LeanCollapse>
      </Wrapper>

      <Modal visible={!!fmOpenCollection} footer={null} closable={false} destroyOnClose>
        {fmOpenCollection ? <ProtofileManager collectionName={fmOpenCollection} /> : null}
      </Modal>
    </Sider>
  );
};

export default CollectionSider;
