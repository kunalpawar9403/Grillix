import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';

const assets = [
  {
    name: 'hero-spinach.jpg',
    url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'green-veggie-bowl.jpg',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'rainbow-quinoa-bowl.jpg',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'herb-bean-sandwich.jpg',
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'fresh-salad-bowl.jpg',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'broccoli-ingredient.jpg',
    url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'brassica-ingredient.jpg',
    url: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'spinach-ingredient.jpg',
    url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'restaurant-interior-1.jpg',
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'restaurant-interior-2.jpg',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'gift-card-fathers-day.jpg',
    url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'gift-card-spring.jpg',
    url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'avatar-jhon.jpg',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=85',
  },
  {
    name: 'springtime-greens.jpg',
    url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=85',
  }
];

const destDir = path.resolve('public/images');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadFile(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(destDir, item.name);
    const file = fs.createWriteStream(dest);
    
    https.get(item.url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded: ${item.name}`);
            resolve();
          });
        }).on('error', (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${item.name}`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading assets to public/images...');
  for (const item of assets) {
    try {
      await downloadFile(item);
    } catch (e) {
      console.error(`Failed ${item.name}:`, e.message);
    }
  }
  console.log('Finished downloading assets.');
}

run();
