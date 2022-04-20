cd ~/Spotifier
git pull
cd Spotifier
cd frontend
npm run dev
sudo cp ./build/main.js /var/www/html/static/frontend
sudo systemctl restart apache2
cd ..
cd ..
