import React from "react";
import TopBar from "../../components/TopBar/TopBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./home.css";
import NewEntryForm from "../../components/New Entry/NewEntryForm";
import axios from 'axios';
import { useEffect, useState } from "react";
import EntryFocused from "../../componentsntryFocused/EntryFocused";
function Home() {
    const [applications, setApplications] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:5555/application/${user.userId}`);
          setApplications(response.data);
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      };
  
      fetchData();
    }, []);


  return (
    <div className="Home">
      <TopBar />
      <div className="home_content">
        <Sidebar />

        <div className="container mx-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Job Position
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Table rows go here */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">1</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Frontend Developer
                </td>
                <td className="px-6 py-4 whitespace-nowrap">ABC Inc</td>
                <td className="px-6 py-4 whitespace-nowrap">City, Country</td>
                <td className="px-6 py-4 whitespace-nowrap">Active</td>
              </tr>
              {applications.map((application) => (
              <tr key={application.id}>
                <td className="px-6 py-4 whitespace-nowrap">{application.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{application.jobPosition}</td>
                <td className="px-6 py-4 whitespace-nowrap">{application.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">{application.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">{application.status}</td>
              </tr>
            ))}
            </tbody>
          </table>
         <NewEntryForm/>
        </div>
      </div>
      <EntryFocused/>
    </div>
  );
}

export default Home;
