// pages/dashboard/index.js
import React from 'react';
import Head from 'next/head';

const Dashboard = () => {
  return (
    <div>
      <Head>
        <title>HelpScout Dashboard</title>
        <meta name="description" content="Dashboard displaying HelpScout ticket data" />
      </Head>
      <header style={{ padding: '2rem', background: '#f5f5f5' }}>
        <h1>HelpScout Dashboard</h1>
      </header>
      <main style={{ padding: '2rem' }}>
        <section>
          <h2>Key Metrics</h2>
          <ul>
            <li>Average Response Time: <span id="avg-response-time">Loading...</span></li>
            <li>Response Time by Agent: <span id="response-time-by-agent">Loading...</span></li>
            <li>Total Tickets by Department: <span id="tickets-by-department">Loading...</span></li>
            <li>Total Tickets by Location: <span id="tickets-by-location">Loading...</span></li>
            <li>Total Tickets by Category: <span id="tickets-by-category">Loading...</span></li>
          </ul>
        </section>
        {/* Future sections for charts and detailed metrics */}
      </main>
    </div>
  );
};

export default Dashboard;
