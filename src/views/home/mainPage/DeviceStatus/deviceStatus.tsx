import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import api from "@/api";
import { message } from "antd";

interface StatusCount {
  status: string;
  count: number;
}

const DeviceStatus: React.FC = () => {
  const [deviceData, setDeviceData] = useState<StatusCount[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [repairCount, setRepairCount] = useState<number>(0);
  const [maintenanceCount, setMaintenanceCount] = useState<number>(0);

  const getEquipmentStatistics = async () => {
    try {
      const result: any = await api.GetEquipmentsStatistics({});

      const { success, data, message: info } = result;
      if (success) {
        setDeviceData(data.equipments);
        setTotal(data.total);

        // 计算报修设备数量和维修中设备数量
        const repairData = data.equipments.find((item: StatusCount) => item.status === "0");
        const maintenanceData = data.equipments.find((item: StatusCount) => item.status === "2");

        setRepairCount(repairData ? repairData.count : 0);
        setMaintenanceCount(maintenanceData ? maintenanceData.count : 0);
      } else {
        message.error(info);
      }
    } catch (error) {
      message.error("获取设备信息失败");
    }
  };

  useEffect(() => {
    getEquipmentStatistics();
  }, []);

  const barOptions = {
    title: {
      text: "设备状态概览",
      left: "center"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    xAxis: {
      type: "category",
      data: deviceData.map(status => {
        switch (status.status) {
          case "0":
            return "报修中";
          case "1":
            return "可用";
          case "2":
            return "维修中";
          default:
            return "未知状态";
        }
      })
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "设备数量",
        type: "bar",
        data: deviceData.map(status => status.count),
        itemStyle: {
          color: (params: any) => {
            const colors = ["#32CD32", "#FF6100", "#E3170D"];
            return colors[params.dataIndex % colors.length];
          }
        }
      }
    ]
  };

  return (
    <div>
      <h2>设备状态</h2>
      <div style={{ fontSize: "1.5em", margin: "20px 0" }}>设备总数: {total}</div>
      <div style={{ fontSize: "1.5em", margin: "20px 0" }}>报修设备数量: {repairCount}</div>
      <div style={{ fontSize: "1.5em", margin: "20px 0" }}>维修中设备数量: {maintenanceCount}</div>
      <ReactECharts option={barOptions} />
    </div>
  );
};

export default DeviceStatus;
