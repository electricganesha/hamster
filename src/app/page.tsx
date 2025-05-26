'use client';

import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('../components/Dashboard'), {
  ssr: false,
});

const Home = () => {
  return <Dashboard />;
};

export default Home;
