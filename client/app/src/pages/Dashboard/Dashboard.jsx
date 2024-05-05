import React, { useState, useEffect, useContext } from "react";
import "./dashboard.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import axios from "axios";
import { UserContext } from "../../App";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
function Dashboard() {
  const [applications, setApplications] = useState([]);
  const { currentUser, token } = useContext(UserContext);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/application/${currentUser._id}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      }
    };

    fetchApplications();
  }, [currentUser, token]);

  const getStatusCounts = () => {
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    return statusCounts;
  };

  const statusCounts = getStatusCounts();
  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Application Status",
        data: Object.values(statusCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#E7E9ED",
          "#4BC0C0",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#E7E9ED",
          "#4BC0C0",
        ],
      },
    ],
  };

  // Fake recruiter data, assuming each application might have multiple recruiters
  const recruiters = applications.reduce(
    (acc, app) => [
      ...acc,
      ...(app.recruiter || []).map((rec) => ({
        name: rec,
        phone: "123-456-7890",
        email: `${rec.split(" ").join(".").toLowerCase()}@company.com`,
        address: "1234 Main St, Anytown, USA",
      })),
    ],
    []
  );

  return (
    <div className="Dashboard">
      <Sidebar />
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>All Applications</h1>
          <h2>Application Overview</h2>
        </header>
        <section className="content">
          <div className="column">
            <div className="upcoming-deadlines card">
              <h3>To Do</h3>
              <div className="tasks card">
        
                {applications.filter(app => app.tasks && app.tasks.length > 0).map((app, index) => (
                <div key={index} className="task-card">
                  <h4>{app.jobTitle || app.university} Tasks</h4>
                  <ul>
                    {app.tasks.map((task, idx) => (
                      <li key={idx}>
                        <span className="task-detail">{task}</span>
                        <span className="task-application">for {app.jobTitle || app.university}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              </div>
            </div>
            <div className="recruiters card">
              <h3>Recruiters</h3>
              <div className="recruiter-cards">
                {recruiters.map((rec, index) => (
                  <div className="recruiter-card" key={index}>
                    <h4>{rec.name}</h4>
                    <p>{rec.phone}</p>
                    <p>{rec.email}</p>
                    <p>{rec.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="column">
            <div className="application-progress card">
              <h3>Application Progress</h3>

              <Pie data={data} />
            </div>
            <div className="tasks card">
              <h3>Messages Notifications</h3>
              {/* List tasks dynamically from the applications data */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
