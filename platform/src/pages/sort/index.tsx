import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Input } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import CreateForm from './components/CreateForm';
import {SortItem, SortItemParams} from '../../../../typings/Sort';
import { querySort, updateSort, addSort, removeSort } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: SortItemParams, formValues:SortItem) => {
  const hide = message.loading('正在添加');
  try {
    if(formValues.sortId){
      await updateSort({...formValues,...fields})
    }else{
      await addSort({ ...fields });
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
const handleRemove = async (selectedRows: SortItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeSort({
      sortIds: selectedRows.map((row) => row.sortId),
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
  const [formValues, setFormValues] = useState({} as SortItem);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<SortItem>[] = [
    {
      title: '分类名称',
      dataIndex: 'sortName',
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
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
      render: (_, record:SortItem) => (
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
      <ProTable<SortItem>
        headerTitle="文章分类"
        actionRef={actionRef}
        rowKey="sortId"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<SortItem>;
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
        request={(params) => querySort(params)}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm
        title={formValues.sortId ? '新建分类':'编辑分类'}
        onCancel={() => {
          handleModalVisible(false)
          setFormValues({} as SortItem)
        }} modalVisible={createModalVisible}>
        <ProTable<SortItem, SortItemParams>
          onSubmit={async (value) => {
            const success = await handleAdd(value,formValues);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="sortId"
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
