import Product from '../models/Product.js'; // Đảm bảo có phần mở rộng .js nếu dùng ES Modules

// Lấy tất cả sản phẩm
export async function getProducts(req, res) {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
}

// Lấy sản phẩm theo ID
export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Thiếu ID sản phẩm' });

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
}

// Tạo sản phẩm mới
export async function createProduct(req, res) {
    try {
        const { title, specs, price, oldPrice, discountPercentage, image, stock, category, description } = req.body;

        if (!title || !price || !image || !category) 
            return res.status(400).json({ message: 'Thiếu thông tin sản phẩm' });

        const newProduct = new Product({
            title,
            specs,
            price,
            oldPrice,
            discountPercentage,
            image,
            stock,
            category,
            description
        });

        await newProduct.save();

        res.status(201).json({ message: 'Sản phẩm đã được tạo', product: newProduct });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
}

// Cập nhật sản phẩm
export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Thiếu ID sản phẩm' });

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        res.status(200).json({ message: 'Sản phẩm đã được cập nhật', product: updatedProduct });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
}

// Giảm stock khi đặt hàng
export async function reduceStock(req, res) {
    try {
        const { _id, quantity } = req.body;

        if (!_id || !quantity) {
            return res.status(400).json({ message: 'Thiếu thông tin sản phẩm hoặc số lượng' });
        }

        // Tìm sản phẩm theo ID
        const product = await Product.findById(_id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Kiểm tra số lượng trong kho
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Số lượng sản phẩm trong kho không đủ' });
        }

        // Giảm stock
        product.stock -= quantity;
        await product.save();

        res.status(200).json({ message: 'Stock đã được cập nhật', product });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
}

// Xóa sản phẩm
export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Thiếu ID sản phẩm' });

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        res.status(200).json({ message: 'Sản phẩm đã bị xóa' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
}
