import multer from 'multer';
import fs from 'fs';
import path from 'path';

const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = 'uploads/products';
        if (file.fieldname === 'profilePicture' || file.fieldname === 'image') {
            dest = 'uploads/profilePicture';
        }
        ensureDir(dest);
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const unique = `${base}_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, unique);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
