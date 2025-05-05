interface ProductDescriptionProps {
  description: string;
  longDescription: string;
}

const ProductDescription = ({ description, longDescription }: ProductDescriptionProps) => {
  return (
    <div>
      <div className="bg-gray-50 p-4 mb-6 border-l-4 border-khoavang-primary">
        <p className="text-base">{description}</p>
      </div>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: longDescription }}></div>
    </div>
  );
};

export default ProductDescription;
