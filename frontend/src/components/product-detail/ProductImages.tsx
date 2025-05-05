// import { useState } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// interface ProductImagesProps {
//   images?: string[]; // Mảng ảnh chính, có thể là undefined
//   thumbnails?: string[]; // Mảng thumbnail, có thể là undefined
// }

// const ProductImages = ({ images = [], thumbnails = [] }: ProductImagesProps) => {
//   const [mainSliderRef, setMainSliderRef] = useState<Slider | null>(null);
//   const [thumbnailSliderRef, setThumbnailSliderRef] = useState<Slider | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const mainSettings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     beforeChange: (_: number, next: number) => setCurrentIndex(next),
//   };

//   const thumbnailSettings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     swipeToSlide: true,
//     focusOnSelect: true,
//     arrows: true,
//     responsive: [
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 3,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-4">
//       {/* Kiểm tra nếu có ảnh chính */}
//       {images.length > 0 ? (
//         <div className="mb-4">
//           <Slider {...mainSettings} ref={(slider) => setMainSliderRef(slider)}>
//             {images.map((image, index) => (
//               <div key={index} className="outline-none">
//                 <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden">
//                   <img
//                     src={image}
//                     alt={`Product image ${index + 1}`}
//                     className="w-full h-full object-cover object-center"
//                   />
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>
//       ) : (
//         <div className="text-center text-gray-500">Không có hình ảnh sản phẩm</div>
//       )}

//       {/* Kiểm tra nếu có thumbnails */}
//       {thumbnails.length > 0 && (
//         <div className="mt-4">
//           <Slider
//             {...thumbnailSettings}
//             ref={(slider) => setThumbnailSliderRef(slider)}
//             asNavFor={mainSliderRef || undefined}
//             className="thumbnail-slider"
//           >
//             {thumbnails.map((thumb, index) => (
//               <div
//                 key={index}
//                 className={`cursor-pointer p-1 outline-none ${
//                   currentIndex === index
//                     ? "border-2 border-khoavang-primary"
//                     : "border-2 border-transparent"
//                 }`}
//                 onClick={() => {
//                   if (mainSliderRef) {
//                     mainSliderRef.slickGoTo(index);
//                   }
//                 }}
//               >
//                 <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden">
//                   <img
//                     src={thumb}
//                     alt={`Thumbnail ${index + 1}`}
//                     className="w-full h-full object-cover object-center"
//                   />
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductImages;


import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ProductImagesProps {
  images?: string[]; // Mảng ảnh chính, có thể là undefined
  thumbnails?: string[]; // Mảng thumbnail, có thể là undefined
}

const ProductImages = ({ images = [], thumbnails = [] }: ProductImagesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Nếu không có ảnh chính, hiển thị thông báo
  if (images.length === 0) {
    return <div className="text-center text-gray-500">Không có hình ảnh sản phẩm</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Chỉ hiển thị ảnh chính đầu tiên */}
      <div className="mb-4">
        <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden">
          <img
            src={images[0]} // Chỉ hiển thị ảnh đầu tiên
            alt="Product image"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Hiển thị chỉ 1 thumbnail nếu có */}
      {thumbnails.length > 0 && (
        <div className="mt-4">
          <div
            className={`cursor-pointer p-1 outline-none ${
              currentIndex === 0 ? "border-2 border-khoavang-primary" : "border-2 border-transparent"
            }`}
            onClick={() => setCurrentIndex(0)} // Mặc định chỉ 1 thumbnail, nên set index = 0
          >
            <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden">
              <img
                src={thumbnails[0]} // Hiển thị thumbnail đầu tiên
                alt="Thumbnail"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
