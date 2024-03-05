'use client';
import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import TrendingSlider from '@/components/TrendingSlider';
import { Anime } from '@/lib/types';
import axios from 'axios';
import { FloatingNav } from '@/components/FloatingNavBar';
import { log } from '@/lib/functions';
import { ConfigProvider, FloatButton } from 'antd';

const NavItems = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Trending',
    link: '/trending',
  },
];

export default function Home() {
  const [data, setData] = useState<Anime[] | null>(null);
  const [popular, setPopular] = useState<Anime[] | null>(null);

  useEffect(() => {
    log('Warn', '', 'Yamete oni-chan!');
    log(
      'Info',
      '',
      "Hey there, welcome to the QuikAnime source code extravaganza! Yep, it's as open as your favorite anime protagonist's heart. Swing by our GitHub repository at https://github.com/codeblitz97/quik-anime for a peek behind the scenes. And hey, if you're the big cheese at a major corporation and you dig what we've whipped up, feel free to slide into my DMs (you can find my social link on my GitHub). Just a humble coder trying to make ends meet in this crazy digital world. Thanks a bunch, sending virtual hugs your way!"
    );
  }, []);

  useEffect(() => {
    (async () => {
      const response = await axios.get('/api/trending?perPage=16');
      const result = await response.data;
      setData(result.results);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const popular = await axios.get('/api/popular?perPage=16');
      const result = await popular.data;
      setPopular(result.results);
    })();
  }, []);

  return (
    <div>
      <FloatingNav navItems={NavItems} />
      <TrendingSlider className="mb-4" />
      <div className="ml-2 mb-2">
        <h1 className="text-2xl font-semibold mb-1 text-red-100">
          Trending Now
        </h1>
        {data ? <Card animeList={data} /> : <div>Loading</div>}
      </div>
      <div className="ml-2">
        <h1 className="text-2xl font-semibold mb-1 text-green-100">
          All Time Popular
        </h1>
        {popular ? <Card animeList={popular} /> : <div>Loading</div>}
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorBgElevated: '#f54242',
            colorText: '#f2f3f5',
          },
        }}
      >
        <FloatButton.BackTop visibilityHeight={200} shape={'circle'} />
      </ConfigProvider>
    </div>
  );
}
