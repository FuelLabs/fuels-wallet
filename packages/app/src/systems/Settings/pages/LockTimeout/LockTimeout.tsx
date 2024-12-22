import { Box, VStack } from '@fuel-ui/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveLockTimeSetting } from '~/systems/CRX/utils';
import { Layout } from '~/systems/Core';
import { Pages } from '~/systems/Core';

const availableTime = [
  '5 minutes',
  '30 minutes',
  '2 hours',
  '6 hours',
  '12 hours',
  'Never',
];
export function LockTimeout() {
  const navigate = useNavigate();
  const goBack = () => navigate(Pages.wallet());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    availableTime[0]
  );

  const handleSelectTime = async (time: string) => {
    setSelectedTime(time);
    if (selectedTime === 'Never') {
      await saveLockTimeSetting(Number.MAX_SAFE_INTEGER);
    }
    if (!selectedTime) return;
    const timeValue = Number.parseInt(selectedTime);

    try {
      await saveLockTimeSetting(timeValue);

      const { data } = await chrome.storage.session.get('data');
      if (data) {
        await chrome.storage.session.set({
          timer: dayjs().add(timeValue, 'minute').valueOf(),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Auto Lock">
      <Layout.TopBar onBack={goBack} />
      <Layout.Content>
        <VStack>
          {availableTime.map((time) => {
            return (
              <Box
                key={time}
                style={cssObj.listItem}
                onClick={() => handleSelectTime(time)}
              >
                <span>{time}</span>
                {time === selectedTime && (
                  <span style={cssObj.checkMark}>✔️</span>
                )}
              </Box>
            );
          })}
        </VStack>
      </Layout.Content>
    </Layout>
  );
}

const cssObj: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '400px',
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '1.5rem',
    color: '#333',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 10px',
    margin: '5px 0',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  checkMark: {
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '50%',
  },
};
