// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import multer from 'multer';

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'product-images',
//         format: async (req, file) => 'png',
//         public_id: (req, file) => file.originalname.split('.')[0],
//     },
// });

// export const multerOptions = multer({ storage: storage });