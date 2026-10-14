import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';

const extraAssets = [
  {
    name: 'salmon-wild-rice.jpg',
    url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'crispy-tofu-bowl.jpg',
    url: 'https://images.unsplash.com/photo-1546069901-d72b9044d081?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'avocado-citrus-bowl.jpg',
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'green-detox-smoothie.jpg',
    url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'acai-superfood-cup.jpg',
    url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'rosemary-focaccia.jpg',
    url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'restaurant-interior-3.jpg',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'restaurant-interior-4.jpg',
    url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1000&q=85',
  }
];

const destDir = path.resolve('public/images');

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
  console.log('Downloading extra culinary and restaurant assets...');
  for (const item of extraAssets) {
    try {
      await downloadFile(item);
    } catch (e) {
      console.error(`Failed ${item.name}:`, e.message);
    }
  }
  console.log('Finished extra assets.');
}

run();
