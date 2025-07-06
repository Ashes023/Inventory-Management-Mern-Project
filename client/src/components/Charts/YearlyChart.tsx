import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useYearlySaleQuery } from '../../redux/features/management/saleApi';
import Loader from '../Loader';
import { Flex } from 'antd';

const YearlyChart = () => {
  const { data: yearlyData, isLoading } = useYearlySaleQuery(undefined);

  if (isLoading)
    return (
      <Flex justify="center" align="center" style={{ height: 300 }}>
        <Loader />
      </Flex>
    );

  const chartData = yearlyData?.data.map(
    (item: { year: number; totalRevenue: number }) => ({
      year: item.year.toString(),
      revenue: item.totalRevenue,
    })
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="revenue" fill="#164863" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default YearlyChart;
