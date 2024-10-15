# Vektorprogrammets nye nettside

Kildekoden er på engelsk

## Startup

Start med å sette opp en postgres database i docker
Lag en database der
Lag en .env fil med disse optionene:

> DATABASE_HOST=**din host** *f.eks. localhost*\
> DATABASE_PORT=**din port** *f.eks. 5432*\
> DATABASE_NAME=**ditt databasenavn** *f.eks. vektorpostgres*\
> DATABASE_USER=**din bruker** *f.eks.postgres*\
> DATABASE_PASSWORD=**ditt passord** *pass123*\

## Recommended Extensions

### Imports Autocomplete

Name: npm Intellisense\
Id: christian-kohler.npm-intellisense\
Description: Visual Studio Code plugin that autocompletes npm modules in import statements\
Publisher: Christian Kohler\
VS Marketplace Link: <https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense>

### Formatting and Linting

Name: Biome\
Id: biomejs.biome\
Description: Toolchain of the web\
Publisher: biomejs\
VS Marketplace Link: <https://marketplace.visualstudio.com/items?itemName=biomejs.biome>

#### Configure format on save in VSCode

Paste the following into `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

### Pretty TypeScript Errors

Name: Pretty TypeScript Errors\
Id: YoavBls.pretty-ts-errors\
Description: Make TypeScript errors prettier and more human-readable in VSCode\
Publisher: yoavbls\
VS Marketplace Link: <https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors>

## Scripts

- `once`
  - Run server
- `watch`
  - Run server w/restart on changes
- `test`
  - Run tests
- `format`
  - Format files in `db` and `src`, safe fixes applied
- `lint`
  - Lint files in `db` and `src`, safe fixes applied
- `check`
  - Format and lint files in `db` and `src`, safe fixes applied

## Info

Tabellnavn er i *flertall* (users > user)

## TODO

Undersøk om vi kan implementere noen sikkerhetsprosedyrer fra: <https://helmetjs.github.io/faq/see-also/>
Implementer auth
Lag ordentlige database schemas
