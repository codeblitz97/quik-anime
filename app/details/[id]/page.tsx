'use client';
import { useState, useEffect } from 'react';
import { AnimeData } from '@/lib/types';
import axios from 'axios';
import { Button, ConfigProvider, Tabs } from 'antd';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { darkenHexColor } from '@/lib/functions';
import {
  FaRegClock,
  FaTags,
  FaStar,
  FaGlobe,
  FaUserFriends,
  FaInfoCircle,
  FaCalendarAlt,
  FaPlayCircle,
} from 'react-icons/fa';
import Card from '@/components/Card';

SwiperCore.use([Navigation]);

const { TabPane } = Tabs;

type Props = {
  params: { id: string };
};

export default function Info({ params }: Readonly<Props>) {
  const [info, setInfo] = useState<AnimeData | null>(null);

  useEffect(() => {
    const fetchAnimeInfo = async () => {
      try {
        const response = await axios.get(`/api/info?id=${params.id}`);
        const result = await response.data;
        setInfo(result);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnimeInfo();
  }, [params.id]);

  if (!info) return null;

  return (
    <div
      style={{
        backgroundColor: info.color
          ? darkenHexColor(info.color, 90)
          : '#ffffff',
      }}
    >
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url(${info.bannerImage})` }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative flex justify-start py-20">
          <div className="max-w-5xl mx-4">
            <div className="flex">
              <img
                src={info.coverImage}
                alt={info.title?.english}
                className="w-48 h-64 object-cover mr-8 rounded-md "
              />
              <div>
                <h1 className="text-4xl font-bold">{info.title?.english}</h1>
                <p className="text-xl text-gray-200">{info.title?.romaji}</p>
                <p className="text-lg">
                  {info.rating?.anilist}/10 | {info.status}{' '}
                </p>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: `${info.color}`,
                      colorPrimaryHover: `${darkenHexColor(
                        info.color as string,
                        30
                      )}`,
                      colorPrimaryBg: `${info.color}`,
                      colorPrimaryBgHover: `${darkenHexColor(
                        info.color as string,
                        30
                      )}`,
                    },
                  }}
                >
                  <Button type="primary" size="large">
                    <div className="flex gap-1">
                      <FaPlayCircle />
                      <span className="-mt-[5.5px] font-semibold">
                        Play now
                      </span>
                    </div>
                  </Button>
                </ConfigProvider>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 text-white">
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: '#fff',
              },
            },
          }}
        >
          <Tabs defaultActiveKey="overview">
            <TabPane
              tab={
                <span className="flex gap-1">
                  <FaInfoCircle /> <span className="-mt-1">Overview</span>
                </span>
              }
              key="overview"
            >
              <div className="flex">
                <div className="w-1/2 text-white">
                  <h2 className="text-3xl font-bold mb-2">Information</h2>
                  <ul className="text-lg">
                    <li className="font-semibold">
                      <FaRegClock className="inline-block mr-2" />
                      Duration:{' '}
                      <span className="font-normal">
                        {info.duration as number} mins
                      </span>
                    </li>
                    <li className="font-semibold">
                      <FaRegClock className="inline-block mr-2" />
                      Total Duration:{' '}
                      <span className="font-normal">
                        {`${
                          (info.duration as number) * Number(info.totalEpisodes)
                        }`}{' '}
                        mins
                      </span>
                    </li>
                    <li className="font-semibold">
                      <FaTags className="inline-block mr-2" />
                      Genres:{' '}
                      <span className="font-normal">
                        {info.genres?.join(', ')}
                      </span>
                    </li>
                    <li className="font-semibold">
                      <FaCalendarAlt className="inline-block mr-2" />
                      Season: <span className="font-normal">{info.season}</span>
                    </li>
                    <li className="font-semibold">
                      <FaGlobe className="inline-block mr-2" />
                      Country:{' '}
                      <span className="font-normal">
                        {info.countryOfOrigin}
                      </span>
                    </li>
                    <li className="font-semibold">
                      <FaUserFriends className="inline-block mr-2" />
                      Liked by:{' '}
                      <span className="font-normal">
                        {info.popularity?.anilist} users
                      </span>
                    </li>
                    <li className="font-semibold">
                      <FaTags className="inline-block mr-2" />
                      Tags:{' '}
                      <span className="font-normal">
                        {info.tags?.join(', ')}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="w-1/2 text-white">
                  <h2 className="text-2xl font-bold">Description</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: info.description
                        ? info.description
                        : 'No description',
                    }}
                  />
                </div>
              </div>
            </TabPane>
            <TabPane tab="Relations" key="relations">
              <Card
                animeList={info.relations ? info.relations : undefined}
                isRelation
                relationImages={info.artwork}
              />
            </TabPane>
            <TabPane tab="Characters" key="characters">
              <div className="flex flex-wrap">
                {/* Display characters here */}
              </div>
            </TabPane>
          </Tabs>
        </ConfigProvider>
      </div>

      <div className="bg-white py-8">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            navigation
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
          >
            {info?.episodes?.data
              ?.find((v) =>
                ['zoro', 'gogoanime'].includes(v.providerId as string)
              )
              ?.episodes?.map((episode) => (
                <SwiperSlide key={episode.id}>
                  <div className="flex">
                    <img
                      src={episode.img as string}
                      alt={episode.title}
                      className="w-32 h-32 object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{episode.title}</h3>
                      <p className="text-sm">{episode.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
