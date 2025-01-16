import React, { useEffect, useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
} from '@ionic/react'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import '../../components/styles/home.css'
import MacrosChart from '../../components/MacrosChart'
import ProgressChart from '../../components/progress-chart'

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonText color="primary">
          <h1>Welcome back</h1>
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
            <MacrosChart />
          </SwiperSlide>

          <SwiperSlide>
            <ProgressChart />
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Home;
