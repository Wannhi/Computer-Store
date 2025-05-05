import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const banners = [
  {
    id: 1,
    imageUrl: 'https://ext.same-assets.com/3001562581/2115116494.webp',
    link: '/',
    altText: 'Build PC gaming tặng phím chuột'
  },
  {
    id: 2,
    imageUrl: 'https://ext.same-assets.com/3001562581/2678017628.webp',
    link: '/',
    altText: 'Tặng balo hoặc chuột và túi chống sốc khi mua laptop'
  },
  {
    id: 3,
    imageUrl: 'https://ext.same-assets.com/3001562581/3281403271.webp',
    link: '/',
    altText: 'Trả góp 36 ngân hàng'
  },
  {
    id: 4,
    imageUrl: 'https://ext.same-assets.com/3001562581/1014726959.webp',
    link: '/',
    altText: 'Đa dạng các loại laptop và thương hiệu'
  },
  {
    id: 5,
    imageUrl: 'https://ext.same-assets.com/3001562581/3514419066.webp',
    link: '/',
    altText: 'Giao hàng nhanh, có trả góp, bảo hành lâu, giá cạnh tranh'
  }
];

const TopBanner = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#e5aa1d] overflow-hidden">
      <div className="container mx-auto relative h-12">
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            to={banner.link}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentBannerIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={banner.imageUrl}
              alt={banner.altText}
              className="w-full h-full object-cover object-center"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopBanner;
