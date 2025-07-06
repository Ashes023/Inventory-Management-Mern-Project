import { Col, Row } from 'antd';
import { useMemo } from 'react';

import MonthlyChart from '../components/Charts/MonthlyChart';
import DailyChart from '../components/Charts/DailyChart';
import YearlyChart from '../components/Charts/YearlyChart'; // ✅ Newly added

import Loader from '../components/Loader';
import { useCountProductsQuery } from '../redux/features/management/productApi';
import { useYearlySaleQuery } from '../redux/features/management/saleApi';

// --- HELPER COMPONENTS ---
const StatCard = ({ icon, title, value, gradient, note }: any) => (
  <div style={styles.statCard} className='stat-card-hover'>
    <div style={{ ...styles.iconWrapper, background: gradient }}>{icon}</div>
    <div style={styles.statInfo}>
      <h3 style={styles.statTitle}>{title}</h3>
      <h1 style={styles.statValue}>{value}</h1>
      {note && <p style={styles.statNote}>{note}</p>}
    </div>
  </div>
);

const ChartContainer = ({ title, children }: any) => (
  <div style={styles.chartContainer}>
    <h2 style={styles.chartTitle}>{title}</h2>
    {children}
  </div>
);

// --- SVG ICONS ---
const StockIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M12.5 2H5.5A2.5 2.5 0 0 0 3 4.5v15A2.5 2.5 0 0 0 5.5 22h13a2.5 2.5 0 0 0 2.5-2.5V8.5z' />
    <polyline points='14 2 14 8 20 8' />
    <line x1='8' y1='14' x2='16' y2='14' />
  </svg>
);

const SalesIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' strokeWidth='2'>
    <circle cx='9' cy='21' r='1' />
    <circle cx='20' cy='21' r='1' />
    <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
  </svg>
);

const RevenueIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' strokeWidth='2'>
    <line x1='12' y1='1' x2='12' y2='23' />
    <path d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
  </svg>
);

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  const { data: products, isLoading: isProductsLoading } = useCountProductsQuery(undefined);
  const { data: yearlyData, isLoading: isYearlyDataLoading } = useYearlySaleQuery(undefined);

  const { totalItemsSold, totalRevenue } = useMemo(() => {
    if (!yearlyData?.data) return { totalItemsSold: 0, totalRevenue: 0 };
    return {
      totalItemsSold: yearlyData.data.reduce(
        (acc: number, cur: { totalQuantity: number }) => acc + cur.totalQuantity,
        0
      ),
      totalRevenue: yearlyData.data.reduce(
        (acc: number, cur: { totalRevenue: number }) => acc + cur.totalRevenue,
        0
      ),
    };
  }, [yearlyData]);

  if (isProductsLoading || isYearlyDataLoading) {
    return <Loader />;
  }

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  return (
    <>
      <style>{`
        .dashboard-container {
          animation: fadeIn 0.8s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stat-card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
      `}</style>

      <div style={styles.dashboardContainer} className='dashboard-container'>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Dashboard</h1>
          <p style={styles.headerSubtitle}>Welcome back! Here's your business snapshot.</p>
        </div>

        {/* Stat Cards */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={8}>
            <StatCard
              icon={<StockIcon />}
              title='Total Stock'
              value={formatNumber(products?.data?.totalQuantity || 0)}
              gradient='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              note='All available items'
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <StatCard
              icon={<SalesIcon />}
              title='Items Sold (Yearly)'
              value={formatNumber(totalItemsSold)}
              gradient='linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
              note='Total units sold this year'
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <StatCard
              icon={<RevenueIcon />}
              title='Total Revenue (Yearly)'
              value={formatCurrency(totalRevenue)}
              gradient='linear-gradient(135deg, #868f96 0%, #596164 100%)'
              note='Gross income this year'
            />
          </Col>
        </Row>

        {/* Daily & Monthly Charts */}
        <Row gutter={[24, 24]} style={{ marginTop: '2rem' }}>
          <Col xs={24} lg={12}>
            <ChartContainer title='Daily Sales & Revenue'>
              <DailyChart />
            </ChartContainer>
          </Col>
          <Col xs={24} lg={12}>
            <ChartContainer title='Monthly Revenue Breakdown'>
              <MonthlyChart />
            </ChartContainer>
          </Col>
        </Row>

        {/* ✅ Yearly Revenue Chart */}
        <Row gutter={[24, 24]} style={{ marginTop: '2rem' }}>
          <Col xs={24}>
            <ChartContainer title='Yearly Revenue Overview'>
              <YearlyChart />
            </ChartContainer>
          </Col>
        </Row>
      </div>
    </>
  );
};

// --- STYLES ---
const styles = {
  dashboardContainer: {
    padding: '2rem',
    background: '#f4f7f9',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '2rem',
  },
  headerTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1a202c',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '1.1rem',
    color: '#718096',
    margin: 0,
  },
  statCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  iconWrapper: {
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    color: '#718096',
    fontSize: '0.9rem',
    fontWeight: '600',
    margin: 0,
    textTransform: 'uppercase' as const,
  },
  statValue: {
    color: '#1a202c',
    fontSize: '2.2rem',
    fontWeight: 'bold',
    margin: '0.25rem 0',
  },
  statNote: {
    color: '#a0aec0',
    fontSize: '0.8rem',
    margin: 0,
  },
  chartContainer: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    height: '100%',
  },
  chartTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
  },
};

export default Dashboard;
