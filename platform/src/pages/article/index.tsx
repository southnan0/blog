import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Input } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import CreateForm from './components/CreateForm';
import {ArticleItem, ArticleItemParams} from '../../../../typings/Article';
import { queryArticle, updateArticle, addArticle, removeArticle } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: ArticleItemParams, formValues:ArticleItem) => {
  const hide = message.loading('正在添加');
  try {
    if(formValues.articleId){
      await updateArticle({...formValues,...fields})
    }else{
      await addArticle({ ...fields });
    }
    hide();
    message.success('保存成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: ArticleItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeArticle({
      articleIds: selectedRows.map((row) => row.articleId),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({} as ArticleItem);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ArticleItem>[] = [
    {
      title: '文章标题',
      dataIndex: 'title',
      rules: [
        {
          required: true,
          message: '文章标题为必填项',
        },
      ],
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: { text: '', status: '0' },
        1: { text: '启用', status: '1' },
        2: { text: '禁用', status: '2' },
      },
    },
    {
      title: '上次修改时间',
      dataIndex: 'updatedTime',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record:ArticleItem) => (
        <>
          <Button type="link" onClick={() => {
            handleModalVisible(true)
            setFormValues(record);
          }}>
            编辑
          </Button>
          <Divider type="vertical" />

        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<ArticleItem>
        headerTitle="文章"
        actionRef={actionRef}
        rowKey="articleId"
        onChange={(_, _filter, _article) => {
          const sorterResult = _article as SorterResult<ArticleItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
          </div>
        )}
        request={(params) => queryArticle(params)}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm
        title={formValues.articleId ? '新建分类':'编辑分类'}
        onCancel={() => {
          handleModalVisible(false)
          setFormValues({} as ArticleItem)
        }} modalVisible={createModalVisible}>
        <ProTable<ArticleItem, ArticleItemParams>
          onSubmit={async (value) => {
            const success = await handleAdd(value,formValues);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="articleId"
          type="form"
          columns={columns}
          rowSelection={{}}
          form={{
            initialValues:formValues
          }}
        />
      </CreateForm>
    </PageContainer>
  );
};

export default TableList;
