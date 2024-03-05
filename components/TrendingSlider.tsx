'use client';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './slider.css';
import { Autoplay, Pagination } from 'swiper/modules';
import type { AnimeList } from '@/lib/types';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import {
  cn,
  generateLighterHexColor,
  generateTextColorHex,
} from '@/lib/functions';

interface TrendingSliderProps {
  className?: string;
}

export default function TrendingSlider({
  className,
}: Readonly<TrendingSliderProps>) {
  const [data, setData] = useState<AnimeList | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  const handleResize = () => {
    const windowHeight = window.innerHeight;

    const mobileThreshold = 480;
    const tabletThreshold = 768;

    setIsMobile(windowHeight < mobileThreshold);
    setIsTablet(
      windowHeight >= mobileThreshold && windowHeight < tabletThreshold
    );
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/trending?perPage=10');
        const result = response.data;
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, []);

  return (
    <div className={`${cn('w-full min-h-[450px] mx-auto', className)}`}>
      <Swiper
        style={{
          // @ts-ignore
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={10}
        autoplay={{ disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        className="my-4"
      >
        {data?.results ? (
          data.results.map((anime, index) => (
            <SwiperSlide key={anime.id}>
              <div className="relative w-full h-80 md:h-96 lg:h-[450px]">
                <Image
                  src={anime.cover as string}
                  alt={anime.title?.english as string}
                  width={2000}
                  height={2000}
                  className="w-full h-full object-cover rounded-lg"
                  priority={true}
                />
                <div className="absolute inset-0 flex flex-col justify-center bg-black bg-opacity-50 p-4">
                  <h3
                    style={{ color: `${anime.color ?? 'white'}` }}
                    className="text-sm md:text-lg lg:text-xl"
                  >
                    Trending #{index + 1}
                  </h3>
                  <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
                    {anime.title?.english}
                  </h2>
                  <p className="text-sm text-gray-300 mb-4">
                    Total Episodes: {anime.totalEpisodes} / Type: {anime.type} /
                    Status: {anime.status}
                  </p>
                  <p
                    data-swiper-parallax="-300"
                    dangerouslySetInnerHTML={{
                      __html: truncateDescription(
                        anime.description?.replace(
                          /\(Source: [^)]+\) /g,
                          ''
                        ) as string,
                        isMobile,
                        isTablet
                      ),
                    }}
                  />
                  <Link
                    href={`/details/${anime.id}`}
                    className="mt-2 max-w-[20px]"
                  >
                    <button className="p-[3px] relative">
                      <div
                        style={{
                          background: `linear-gradient(to right, ${
                            anime.color
                          } 0%, ${generateLighterHexColor(
                            anime?.color ? anime.color : '#ffffff'
                          )} 100%)`,
                        }}
                        className="absolute inset-0 rounded-lg"
                      />
                      <div
                        className="px-8 py-2 bg-transparent rounded-[6px] relative group transition duration-200 hover:bg-gradient-to-r"
                        style={{
                          color: `${generateTextColorHex(
                            anime.color ? anime.color : '#ffffff'
                          )}`,
                        }}
                      >
                        Details
                      </div>
                    </button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="text-center">Loading...</div>
        )}
      </Swiper>
    </div>
  );
}

function truncateDescription(
  description: string,
  isMobile: boolean = false,
  isTab: boolean = false
): string {
  let maxLength;

  if (isMobile) {
    maxLength = 50;
  } else if (isTab) {
    maxLength = 100;
  } else {
    maxLength = 414;
  }

  const lines = description.split('\n');
  let truncatedDescription = lines.slice(0, 3).join('\n');

  if (truncatedDescription.length > maxLength) {
    truncatedDescription =
      truncatedDescription.substring(0, maxLength - 3) + '...';
  }

  return truncatedDescription;
}
