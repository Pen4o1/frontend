import React, { useEffect, useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import './styles/home.css';
import { useHistory } from 'react-router-dom';
import { IonSpinner } from '@ionic/react';
import { useIonViewWillEnter } from '@ionic/react';
import config from '../utils/config';

const ProgressChart: React.FC = () => {
  const [dailyCalories, setDailyCalories] = useState<number>(0);
  const [targetCalories, setTargetCalories] = useState<number>(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState(false);
  const history = useHistory();

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        history.push('/login');
        return;
      }

      const response = await fetch( `${config.BASE_URL}/api/get/daily/macros`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { daily_calories, goal } = data;

      setDailyCalories(daily_calories || 0);
      setTargetCalories(goal || 0);

      if (daily_calories > goal) {
        setWarning(
          `Warning: You have exceeded your calorie goal! ${daily_calories} of ${goal}`
        );
      } else {
        setWarning(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // useEffect runs once on component mount
  useEffect(() => {
    console.log('ProgressChart: Fetching data on mount');
    fetchData();
  }, [history]); // Ensures the fetch happens only once when the component mounts

  // useIonViewWillEnter runs every time the view is entered
  useIonViewWillEnter(() => {
    if(!hasFetched){
      console.log('ProgressChart: Fetching data on page entry');
      fetchData();
      setHasFetched(true);
    }
  });

  const progressPercentage = targetCalories
    ? (dailyCalories / targetCalories) * 100
    : 0;

  const progress = progressPercentage > 100 ? 100 : progressPercentage;

  const data = [{ name: 'Progress', value: progress }];

  return (
    <div className="macros-chart">
      {loading ? (
        <div className="loader">
          <IonSpinner name="crescent" />
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              barSize={20}
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={18}
                fill="#57b9ff"
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="progress-label"
              >
                {Math.round(progress)}% <br />
              </text>
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="calories-label"
              >
                {dailyCalories} / {targetCalories}
              </text>
            </RadialBarChart>
          </ResponsiveContainer>

          {warning && <div className="warning-message">{warning}</div>}
        </>
      )}
    </div>
  );
};

export default ProgressChart;
