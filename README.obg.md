# README qbus

## HOWTO: Upstream releases übernehmen, bauen und publishen

WICHTIG: wir arbeiten noch mit ant-design 3, während mittlerweile ant-design 4 released wurde. Unser master Branch enthält noch den 3.x Code plus unsere Änderungen. upstream/master ist jedoch - wie bereits geschrieben - schon auf 4.x (oder später). Daher müssen wir immer mit 3.x.x Tags oder 3.x-stable branch mergen. Wir dürfen NIE mit upstream/master Branch mergen (es sei denn wir schaffen den Sprung auf 4.x (oder später))

```bash
git fetch --all --tags -p
git checkout master
git merge 3.18.1
```

- conflicts resolven (auf jeden fall bei package.json wegen eigenen versionsnummern) vi package.json # -> dort bei "version" noch -obg.1 anhängen, also 3.18.1 -> 3.18.1-obg.1 (bei späteren patches -obg.2 etc.)

# antd wird noch im Node 10 env gebaut, wechsle zu dieser Version

# WICHTIG: wenn in aktueller Shell zb. im QBUS-JS Projekt weitergearbeitet werden soll, dann

# am Ende wieder vorherige Node-Version verwenden (nvm use system oder ...)

nvm use 10

# neue abhängigkeiten installieren, wichtig (vor commit, da dort

# dann eventuell pre-commit checks laufen (z.b. tests), die

# mit veralteten modulen fehlschlagen würden)

npm install

# triggert pre-commit checks. wenn es probleme gibt: fixes müssen

# added werden, damit sie beim nächsten commit-versuch auch greifen

git commit

# mehr infos zum Publishing siehe gleichnamiges Kapitel weiter unten

npm run pub

git push

# falls probleme beim push nach github kann es an workflows in

# .github/workflows liegen, die von upstream gefetcht wurden und

# die GitHub bei einem Push ins eigene origin erstmal ablehnt.

# Diese Files am besten im Fork mit git rm löschen

## In qbus-js installieren:

npm install --save-exact antd@3.18.1-obg.1

## Publishing

npm publish (zu lokalem npm):

    npm run pub

Ohne automatisches Tag:

    npm run pub -- --skip-tag
    (gibt auch noch npm run pub -- --force option)

npm publish ohne die ganzen ant scripts, hilfreich beim re-publish wenn npm run pub komplett geklappt hat, aber der eigentliche publish fehlschlug (registry nicht erreichbar, package zu groß, ...):

npm publish --ignore-scripts
