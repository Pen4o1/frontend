import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './styles/home.css';
import { useHistory } from 'react-router-dom';
import { IonSpinner } from '@ionic/react';
import { useIonViewWillEnter } from '@ionic/react';
import config from '../utils/config';

const COLORS = ['#FFBB28', '#0088FE', '#00C49F'];

const MacrosChart: React.FC = () => {
  const [data, setData] = useState([
    { name: 'Fats', value: 0 },
    { name: 'Carbs', value: 0 },
    { name: 'Proteins', value: 0 },
  ]);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState(false);
  const history = useHistory();

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        history.push('/login');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/get/daily/macros`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch macros data.');
      }

      const result = await response.json();

      const fetchedData = [
        { name: 'Fats', value: result.fat_consumed },
        { name: 'Carbs', value: result.carbohydrate_consumed },
        { name: 'Proteins', value: result.protein_consumed },
      ];

      const isAllZero = fetchedData.every((item) => item.value === 0);
      if (isAllZero) {
        setData([
          { name: 'Fats', value: 30 },
          { name: 'Carbs', value: 50 },
          { name: 'Proteins', value: 20 },
        ]);
      } else {
        setData(fetchedData);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // useEffect runs once on component mount
  useEffect(() => {
    console.log('MacrosChart: Fetching data on mount');
    fetchData();
  }, [history]); // Ensures the fetch happens only once when the component mounts

  // useIonViewWillEnter runs every time the view is entered
  useIonViewWillEnter(() => {
    if(!hasFetched) {
      console.log('MacrosChart: Fetching data on page entry');
      fetchData();
      setHasFetched(true);
    }
  });

  // Allow handling clicks on chart segments
  /*to make an interface for this*/const handleClick = (data: any, index: number) => {
    setSelectedSegment(`${data.name}: ${data.value}`);
  };

  return (
    <div className="macros-chart">
      {loading ? (
        <div className="loader">
          <IonSpinner name="crescent" />
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              onClick={handleClick}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
      {selectedSegment && !loading && (
        <div className="selected-segment-info">
          <p className="segment-info">
            You clicked on: <strong>{selectedSegment}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default MacrosChart;
