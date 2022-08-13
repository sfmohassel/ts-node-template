# ts-node-template

![Screenshot 2022-07-18 234510](https://user-images.githubusercontent.com/20520614/179624179-9867b5d9-fd28-4304-8042-c99a5d8d953c.png)

A simple npx template for typescript node applications with prettier, nvmrc, eslint and nodemon.

## Features

- Typescript
- Eslint
- Prettier formatting
- Using NVM to fix node version to latest LTS version
- Example .gitignore
- Live reloading with nodemon

## Publish

- Update package.json version
- npm publish --registry https://registry.npmjs.org --access=public

## Usage

```bash
# make sure have node version > 16.x
# cd into your repository root
npm init -y
npx @saeidjoker/ts-node-template@latest
```

After that, you can test your app with this command
```bash
npm run start:dev
```

This will print `hi` on the console. You can change the contents of `src/index.ts` and save the file and the app will cold-reload :-)

Enjoy!
