import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IResume } from "@/types/backend";
import {
  ActionType,
  ProColumns,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Space, message, notification, Popconfirm } from "antd";
import { useState, useRef } from "react";
import dayjs from "dayjs";
import { callDeleteResume, callFetchJob } from "@/config/api";
import queryString from "query-string";
import { fetchResume } from "@/redux/slice/resumeSlide";
import ViewDetailResume from "@/components/admin/resume/view.resume";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import { sfIn } from "spring-filter-query-builder";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ResumePage = () => {
  const tableRef = useRef<ActionType>();

  const isFetching = useAppSelector((state) => state.resume.isFetching);
  const meta = useAppSelector((state) => state.resume.meta);
  const resumes = useAppSelector((state) => state.resume.result);
  const dispatch = useAppDispatch();

  const [dataInit, setDataInit] = useState<IResume | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteResume = async (id: string | undefined) => {
    if (!id) return;

    const res = await callDeleteResume(id);

    if (res && res.statusCode === 200) {
      message.success("Xóa Resume thành công");
      reloadTable();
    } else {
      notification.error({
        message: "Xóa Resume thất bại",
        description: res?.message,
      });
    }
  };

  const columns: ProColumns<IResume>[] = [
    {
      title: "Id",
      dataIndex: "id",
      width: 60,
      render: (_, record) => (
        <a
          onClick={() => {
            setOpenViewDetail(true);
            setDataInit(record);
          }}
        >
          {record.id}
        </a>
      ),
      hideInSearch: true,
    },

    {
      title: "Trạng Thái",
      dataIndex: "status",
      sorter: true,
      renderFormItem: () => (
        <ProFormSelect
          mode="multiple"
          allowClear
          showSearch
          valueEnum={{
            PENDING: "PENDING",
            REVIEWING: "REVIEWING",
            APPROVED: "APPROVED",
            REJECTED: "REJECTED",
          }}
          placeholder="Chọn trạng thái"
        />
      ),
    },

    {
      title: "Job",
      dataIndex: ["job", "name"],
      hideInSearch: true,
    },

    {
      title: "Job",
      dataIndex: "jobId",
      hideInTable: true,
      renderFormItem: () => (
        <ProFormSelect
          showSearch
          placeholder="Chọn Job"
          request={async () => {
            const res = await callFetchJob("page=1&size=100");

            if (res?.data?.result) {
              return res.data.result.map((item: any) => ({
                label: item.name,
                value: item.id,
              }));
            }

            return [];
          }}
        />
      ),
    },

    {
      title: "Company",
      dataIndex: "companyName",
      hideInSearch: true,
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: true,
      width: 200,
      render: (_, record) =>
        record.createdAt
          ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")
          : "",
      hideInSearch: true,
    },

    {
      title: "Updated At",
      dataIndex: "updatedAt",
      sorter: true,
      width: 200,
      render: (_, record) =>
        record.updatedAt
          ? dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")
          : "",
      hideInSearch: true,
    },

    {
      title: "Actions",
      width: 120,
      hideInSearch: true,
      render: (_, entity) => (
        <Space>
          <EditOutlined
            style={{
              fontSize: 18,
              color: "#faad14",
              cursor: "pointer",
            }}
            onClick={() => {
              setOpenViewDetail(true);
              setDataInit(entity);
            }}
          />

          <Access permission={ALL_PERMISSIONS.RESUMES.DELETE}>
            <Popconfirm
              title="Xác nhận xóa Resume"
              description="Bạn có chắc chắn muốn xóa resume này?"
              onConfirm={() => handleDeleteResume(entity.id)}
              okText="Xóa"
              cancelText="Hủy"
              placement="left"
            >
              <DeleteOutlined
                style={{
                  fontSize: 18,
                  color: "#ff4d4f",
                  cursor: "pointer",
                }}
              />
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  const buildQuery = (params: any, sort: any) => {
    const clone = { ...params };

    let filters: string[] = [];

    // filter status
    if (clone?.status?.length) {
      filters.push(sfIn("status", clone.status).toString());
      delete clone.status;
    }

    // filter job
    if (clone?.jobId) {
      filters.push(sfIn("job.id", [clone.jobId]).toString());
      delete clone.jobId;
    }

    if (filters.length) {
      clone.filter = filters.join(" and ");
    }

    clone.page = clone.current;
    clone.size = clone.pageSize;

    delete clone.current;
    delete clone.pageSize;

    let temp = queryString.stringify(clone, { encode: true });

    let sortBy = "";

    if (sort?.status) {
      sortBy =
        sort.status === "ascend" ? "sort=status,asc" : "sort=status,desc";
    }

    if (sort?.createdAt) {
      sortBy =
        sort.createdAt === "ascend"
          ? "sort=createdAt,asc"
          : "sort=createdAt,desc";
    }

    if (sort?.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend"
          ? "sort=updatedAt,asc"
          : "sort=updatedAt,desc";
    }

    if (!sortBy) {
      temp = `${temp}&sort=updatedAt,desc`;
    } else {
      temp = `${temp}&${sortBy}`;
    }

    return temp;
  };

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}>
        <DataTable<IResume>
          actionRef={tableRef}
          headerTitle="Danh sách Resumes"
          rowKey="id"
          loading={isFetching}
          columns={columns}
          dataSource={resumes}
          request={async (params, sort): Promise<any> => {
            const query = buildQuery(params, sort);
            dispatch(fetchResume({ query }));

            return {
              data: resumes,
              success: true,
              total: meta.total,
            };
          }}
          scroll={{ x: true }}
          pagination={{
            current: meta.page,
            pageSize: meta.pageSize,
            showSizeChanger: true,
            total: meta.total,
            showTotal: (total, range) => (
              <div>
                {range[0]}-{range[1]} trên {total} rows
              </div>
            ),
          }}
          rowSelection={false}
          toolBarRender={() => []}
        />
      </Access>

      <ViewDetailResume
        open={openViewDetail}
        onClose={setOpenViewDetail}
        dataInit={dataInit}
        setDataInit={setDataInit}
        reloadTable={reloadTable}
      />
    </div>
  );
};

export default ResumePage;
