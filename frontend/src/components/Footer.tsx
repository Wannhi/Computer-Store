import { Link } from 'react-router-dom';
import { FaFacebookF, FaYoutube, FaTiktok, FaPhone } from 'react-icons/fa';
import Logo from '../../Logo.png';


const Footer = () => {
  return (
    <footer className="bg-[#32343a] text-white pt-6">
      {/* Benefits/Features Section */}
      <div className="bg-[#e5aa1d] py-4 mb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-white p-3">
                <FaPhone className="text-[#e5aa1d] text-xl" />
              </div>
              <div>
                <p className="font-bold">Dùng thử 7 ngày</p>
                <p className="text-sm">Đổi trả dễ dàng</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-white p-3">
                <FaPhone className="text-[#e5aa1d] text-xl" />
              </div>
              <div>
                <p className="font-bold">1 đổi 1 trong 30 ngày</p>
                <p className="text-sm">Với lỗi phần cứng</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-white p-3">
                <FaPhone className="text-[#e5aa1d] text-xl" />
              </div>
              <div>
                <p className="font-bold">Bảo hành 12 tháng</p>
                <p className="text-sm">Với lỗi kỹ thuật</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-white p-3">
                <FaPhone className="text-[#e5aa1d] text-xl" />
              </div>
              <div>
                <p className="font-bold">Mua trả góp</p>
                <p className="text-sm">Duyệt nhanh 15 phút</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showrooms Section */}
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-xl font-bold text-center mb-6">HỆ THỐNG CÁC SHOWROOM</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-700 rounded overflow-hidden">
            <div className="bg-[#e5aa1d] text-black font-bold p-2 flex items-center">
              <span className="bg-white text-[#e5aa1d] rounded-full w-6 h-6 flex items-center justify-center mr-2">1</span>
              <span>12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, <br/>Hồ Chí Minh, Việt Nam</span>
            </div>
            <div className="p-2 flex items-center">
              <FaPhone className="mr-2" />
              <span>Hotline: 0931.333.057</span>
            </div>
            <div className="p-2 bg-gray-800">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.858169091633!2d106.68426511012773!3d10.822164158304892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBUUC5IQ00!5e0!3m2!1svi!2s!4v1745056210193!5m2!1svi!2s"
              width="100%"
              height="300px"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          </div>
          <div className="border border-gray-700 rounded overflow-hidden">
            <div className="bg-[#e5aa1d] text-black font-bold p-2 flex items-center">
              <span className="bg-white text-[#e5aa1d] rounded-full w-6 h-6 flex items-center justify-center mr-2">2</span>
              <span>53 Đ. Phạm Văn Chiêu, Phường 8, Gò Vấp, <br/> Hồ Chí Minh, Việt Nam</span>
            </div>
            <div className="p-2 flex items-center">
              <FaPhone className="mr-2" />
              <span>Hotline: 0931.333.057</span>
            </div>
            <div className="p-2 bg-gray-800">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.490168837026!2d106.64056121012797!3d10.8502737577836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175294cd7080c4f%3A0x2785e896380e241!2zxJDhuqFpIGjhu41jIEPDtG5nIG5naGnhu4dwIFRQLkhDTSBjxqEgc-G7nyAy!5e0!3m2!1svi!2s!4v1745056876111!5m2!1svi!2s"
              width="100%"
              height="300px"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          </div>
          <div className="border border-gray-700 rounded overflow-hidden">
            <div className="bg-[#e5aa1d] text-black font-bold p-2 flex items-center">
              <span className="bg-white text-[#e5aa1d] rounded-full w-6 h-6 flex items-center justify-center mr-2">3</span>
              <span>10 Đường Nguyễn Văn Dung, Phường 6, <br /> Gò Vấp, Hồ Chí Minh, Việt Nam</span>
            </div>
            <div className="p-2 flex items-center">
              <FaPhone className="mr-2" />
              <span>Hotline: 0931.333.057</span>
            </div>
            <div className="p-2 bg-gray-800">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5207396195965!2d106.67696571012806!3d10.847941357826903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752952050e0161%3A0x34bb62d5ee89d926!2zVHXhu5VpIFRy4bq7IFRvd2VyICjEkOG6oWkgaOG7jWMgQ8O0bmcgbmdoaeG7h3AgY8ahIHPhu58gTmd1eeG7hW4gVsSDbiBEdW5nKQ!5e0!3m2!1svi!2s!4v1745056956344!5m2!1svi!2s"
              width="100%"
              height="300px"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Contact Section */}
      {/* <div className="container mx-auto px-4 mb-6">
        <div className="flex flex-wrap justify-center items-center">
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 px-4">
            <input
              type="text"
              placeholder="Số Điện Thoại"
              className="border border-gray-300 bg-white text-gray-800 px-4 py-2 rounded"
            />
            <button className="bg-[#e5aa1d] text-white px-4 py-2 rounded font-bold">GỬI</button>
          </div>
        </div>
      </div> */}

      {/* Footer Information */}
      <div className="container mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="mb-4 block">
              <img
                // src="https://ext.same-assets.com/3001562581/864712427.webp"
                src={Logo}
                alt="Khóa Vàng Logo"
                className="h-12"
              />
            </Link>
            <p className="mb-2">Công ty TNHH Máy Tính Cậu Vàng</p>
            <p className="mb-1">284/1 Đề Thám Quận 4, Tp Hồ Chí Minh</p>
            <p className="mb-1">Số điện thoại: 0931.333.057</p>
            <p className="mb-1">MST: 0313359525</p>
            <p className="mb-3">E-mail: sales@cauvang.vn</p>
            <div className="flex space-x-2">
              <a href="#" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <FaFacebookF />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                <FaYoutube />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <FaTiktok />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2">
              <li><Link to="/chinh-sach-bao-hanh">Chính sách bảo hành</Link></li>
              <li><Link to="/chinh-sach-doi-tra">Chính sách đổi trả</Link></li>
              <li><Link to="/chinh-sach-van-chuyen">Chính sách vận chuyển</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật thông tin</Link></li>
              <li><Link to="/huong-dan-thanh-toan">Hướng dẫn thanh toán</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Thông tin doanh nghiệp</h3>
            <ul className="space-y-2">
              <li><Link to="/gioi-thieu">Giới thiệu Cậu Vàng</Link></li>
              <li><Link to="/hop-tac">Hợp tác kinh doanh</Link></li>
              <li><Link to="/tuyen-dung">Tuyển dụng</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Copyright © 2024 - Bản quyền thuộc về Cậu Vàng</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
