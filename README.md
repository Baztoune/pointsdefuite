# pointsdefuite
pointsdefuite.b5n.fr

## Install
```
bundle install
bundle exec jekyll serve
```

## Known limitations / bugs
- ✅ FIXED Relative path don't behave the same on local and on github. In location.html, remove the `./` in local, keep it for github.
- ✅ FIXED Trailing slash is added in local, but not supported on github
- https not fully supported as leaflet is a limited free tier

For local vs github relative path comparison
- http://127.0.0.1:4000/paysage/saint-pierre-en-port/
- https://pointsdefuite.b5n.fr/paysage/saint-pierre-en-port
- http://127.0.0.1:4000/paysage/ecosse/gruinard-bay---scotland/
- https://pointsdefuite.b5n.fr/paysage/ecosse/gruinard-bay---scotland

## Utils
```
-- rename files
find . -iname '*.jpeg' -execdir mv {} photo.jpg \;
find . -iname '*.mp3' -execdir mv {} sound.mp3 \;
find . -iname '*.ogg' -execdir mv {} sound.ogg \;
```
