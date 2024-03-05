'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Anime } from '@/lib/types';
import Image from 'next/image';
import { log } from '@/lib/functions';

interface CardProps {
  animeList?:
    | Anime[]
    | {
        id?: string;
        type?: string;
        title?: {
          native?: string;
          romaji?: string;
          english?: string | null;
        };
        format?: string;
        relationType?: string;
      }[];

  isRelation?: boolean;
  relationImages?: {
    img?: string;
    type?: string;
    providerId?: string;
  }[];
}

const Card: React.FC<CardProps> = ({
  animeList,
  isRelation = false,
  relationImages = null,
}) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    log('Debug', 'QuikAnime.Debug.Card', 'Loaded component');
  });

  return (
    <>
      {isRelation ? (
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          slidesPerGroup={1}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
        >
          {(
            animeList as {
              id?: string;
              type?: string;
              title?: {
                native?: string;
                romaji?: string;
                english?: string | null;
              };
              format?: string;
              relationType?: string;
            }[]
          ).map((anime, index) => {
            return (
              <SwiperSlide
                key={anime.id}
                onClick={() => (window.location.href = `/details/${anime.id}`)}
                className="cursor-pointer"
              >
                <motion.div
                  className="relative h-auto w-full sm:w-64 overflow-hidden bg-transparent rounded-lg shadow-md"
                  onHoverStart={() => setHoveredId(Number(anime.id))}
                  onHoverEnd={() => setHoveredId(null)}
                >
                  <div className="relative">
                    <Image
                      src={relationImages?.[index + 4]?.img as string}
                      alt={anime.title?.english as string}
                      width={1024}
                      height={1024}
                      className="w-full h-2/3 object-cover max-h-[360px]"
                    />
                    <AnimatePresence>
                      {hoveredId === Number(anime.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 0.5, height: '15%' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute top-0 left-0 right-0"
                          style={{
                            background:
                              'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)',
                          }}
                        ></motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {hoveredId === Number(anime.id) && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-0 left-0 right-0 p-4 text-white pointer-events-none"
                      >
                        <div className="text-sm text-center">
                          {`${anime.relationType} | ${anime.type} | ${anime.title?.english}`}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <h3 className="font-semibold text-center text-lg mb-2 text-white">
                    {anime.title?.english}
                  </h3>
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          slidesPerGroup={1}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
        >
          {(animeList as Anime[]).map((anime) => (
            <SwiperSlide
              key={anime.id}
              onClick={() => (window.location.href = `/details/${anime.id}`)}
              className="cursor-pointer"
            >
              <motion.div
                className="relative h-auto w-full sm:w-64 overflow-hidden bg-transparent rounded-lg shadow-md"
                onHoverStart={() => setHoveredId(Number(anime.id))}
                onHoverEnd={() => setHoveredId(null)}
              >
                <div className="relative">
                  <Image
                    src={anime.image as string}
                    alt={anime.title?.english as string}
                    width={1024}
                    height={1024}
                    className="w-full h-2/3 object-cover max-h-[360px]"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 duration-200 hover:blur-[2px]"></div>
                </div>
                <AnimatePresence>
                  {hoveredId === Number(anime.id) && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-0 left-0 right-0 p-4 text-green-100 pointer-events-none"
                    >
                      <div className="text-sm text-center">
                        {`${anime.totalEpisodes} episodes | ${anime.type} | ${anime.status}`}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <h3 className="font-semibold text-center text-lg mb-2">
                  {anime.title?.english}
                </h3>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default Card;
