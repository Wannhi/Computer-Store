interface ProductSpecificationsProps {
  specifications: {
    label: string;
    value: string;
  }[];
}

const ProductSpecifications = ({ specifications }: ProductSpecificationsProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 w-1/6 font-semibold">STT</th>
              <th className="py-2 px-4 w-2/6 font-semibold">THÔNG SỐ</th>
              <th className="py-2 px-4 w-3/6 font-semibold">THÔNG TIN</th>
            </tr>
          </thead>
          <tbody>
            {specifications.map((spec, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="py-3 px-4 border-b border-gray-200">{index + 1}</td>
                <td className="py-3 px-4 border-b border-gray-200 font-medium">{spec.label}</td>
                <td className="py-3 px-4 border-b border-gray-200">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductSpecifications;
