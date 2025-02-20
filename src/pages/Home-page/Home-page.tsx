import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonText,
} from '@ionic/react';
import { useIonViewWillEnter } from '@ionic/react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../components/styles/home.css';
import MacrosChart from '../../components/MacrosChart';
import ProgressChart from '../../components/progress-chart';

const Home: React.FC = () => {
  const [message, setMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useIonViewWillEnter(() => {
    setReloadKey((prevKey) => reloadKey + 1);
    setMessage('Welcome back!'); 
  });

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonText color="primary">
          <h1>{message}</h1>
        </IonText>

        <Swiper
          className="my-swiper"
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
        >
          <SwiperSlide>
            <MacrosChart key={reloadKey}/>
          </SwiperSlide>

          <SwiperSlide>
            <ProgressChart key={reloadKey}/>
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Home;
