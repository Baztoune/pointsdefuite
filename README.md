# pointsdefuite

pointsdefuite.b5n.fr

## Install

```
$ rvm use 2.7.2
$ bundle install
$ bundle exec jekyll serve
```

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

## TODO

- limitation de taille (
  - remove ogg ?
  - git-lfs ?
  - outsource CDN ?
- définir régions du monde split horizontal/vertical
- utiliser mapbox Hélène
- bug affichage navigation vers photo puis retour sur map
- ajouter précédent/suivant
- CSS mobile (footer)
