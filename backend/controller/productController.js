const Product = require("../model/product");
const cloudinary = require("../config/cloudinary");

const getProducts = async (req,res)=>{
    try{
        const products = await Product.find({});
        res.json(products);
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}

const getProductById = async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }else{
            res.status(404).json({message:"Product not found"});
        }
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

const createProduct = async (req,res)=>{
    try{
        const {name,description,price,stock,category} = req.body;
        let imageUrl = "";
        if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        }else{
            return res.status(400).json({message:"upload image"})
        }
        const product = new Product({
            name,
            description,
            price,
            stock,
            category,
            imageUrl
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server has error"});
    }
}


const updateProduct = async (req,res)=>{
    try{
        const {name,description,price,stock,category} = req.body;
        let imageUrl = "";
        const product = await Product.findById(req.params.id);
        if(product){
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = product.stock || stock;
            if(req.file){
                const result = await cloudinary.uploader.upload(req.file.path);
                console.log(result);
                product.imageUrl = result.secure_url;
            }
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }else{
            res.status(500).json({message:"Product not found"});
        }
    }
    catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

const deleteProduct =async (req,res) =>{
    try{
        const product = await Product.findById(req.params.id);

        if(product){
            await product.deleteOne();
            res.json({message:"Product remove"});
        }else{
            res.status(404).json({message:"Product not found"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Serever Error"});
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}





