import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types';
import { useState } from 'react';

const API_KEY = 'live_FVD1d5xGtG8deqw0tQipxL1iXrLAzr8DT3xi1ivckPvcbSOieccUvtj4QH7NfvxO';

export const Home = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();
  const [loading, setLoading] = useState(false);

  const fetchRandomImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=1&api_key=${API_KEY}`);
      const data = await response.json();
      const imageUrl = data[0]?.url;

      if (imageUrl) {
        await bridge.send('VKWebAppShowStoryBox', {
          background_type: 'image',
          url: imageUrl,
        });
      }
    } catch (error) {
      console.error('Ошибка при получении случайного изображения:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      {fetchedUser && (
        <Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
          <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )}

      <Group header={<Header mode="secondary">Navigation Example</Header>}>
        <Div>
          <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.push('persik')}>
            Покажите Персика, пожалуйста!
          </Button>
        </Div>
        <Div>
          <Button stretched size="l" mode="primary" loading={loading} onClick={fetchRandomImage}>
            Покажите котика, пожалуйста (чтобы в историю выложить)!
          </Button>
        </Div>
      </Group>
    </Panel>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};
