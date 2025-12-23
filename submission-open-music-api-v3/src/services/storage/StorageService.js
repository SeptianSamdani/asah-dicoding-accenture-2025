import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StorageService {
  constructor(folder) {
    this._folder = path.resolve(__dirname, '../../../', folder);

    if (!fs.existsSync(this._folder)) {
      fs.mkdirSync(this._folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.name;
    const filepath = path.resolve(this._folder, filename);

    return new Promise((resolve, reject) => {
      file.mv(filepath, (error) => {
        if (error) {
          reject(error);
        }
        resolve(filename);
      });
    });
  }

  getFileUrl(filename) {
    return `http://${process.env.HOST}:${process.env.PORT}/uploads/covers/${filename}`;
  }
}

export default StorageService;