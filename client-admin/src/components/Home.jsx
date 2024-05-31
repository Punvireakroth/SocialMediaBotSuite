import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Ensure Chart.js is correctly imported

const Home = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchDistrictData = async () => {
            try {
                const response = await fetch('http://localhost:8080/districts');
                const data = await response.json();

                // Process data to get count of users from each district
                const districtCount = data.reduce((acc, district) => {
                    acc[district.name] = (acc[district.name] || 0) + 1;
                    return acc;
                }, {});

                // Prepare data for Chart.js
                const labels = Object.keys(districtCount);
                const counts = Object.values(districtCount);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Number of Users',
                            data: counts,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching district data:', error);
            }
        };

        fetchDistrictData();
    }, []);

    return (
        <div className="p-4">
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-center mb-4">បំណែកចែកភ្ញៀវតាមខណ្ឌនីមួយៗ</h2>
                <div className="max-w-4xl mx-auto">
                    <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
};

export default Home;
