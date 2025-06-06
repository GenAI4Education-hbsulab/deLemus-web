This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

!!Ensure you have generated an SSH key for GitHub, a private key on-prem ( at ./ssh), public key put inside the GitHub account settings
## Getting Started
first, clone the repo to your local device with 
```bash
git clone git@github.com:hans2001/deLemus-web.git 
```
assume the name of the repo is deLemus-web, then cd into <username>/deLemus-web
at root directory(deLemus-web/),run 
```bash 
npm install
```
to install required packages for the project( this is specified in the pakcage.json)

FYI: Usually, the deployed branch is branch main, and the development branch is branch dev. Integrate all members' work at the branch dev
. Once anyone pushes to the branch main, deployment at Vercel will be triggered, so the admin should protect the branch main from being pushed with approval!!

Then, run the development server:
```bash
npm run dev
# or
yarn dev (if you use yarn install)
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

All scenes can be found in the `components` folder and changes can be made there.

Colyseus files can be found in the [`colyseus branch`](https://github.com/hans2001/deLemus-web/tree/colyseus?tab=readme-ov-file) inside the server folder. Currently multipayer is only used in the virtual classroom. If multiplayer is needed for other scenes, create a new room in `/src/rooms`.

To start the colyseus server locally, go to the server folder and start it using:
```bash
npm start
```
make sure to change client instance in your scene to [http://localhost:2567](http://localhost:2567) (colyseus default). At the moment it is [https://delemus-backend.fly.dev/](https://delemus-backend.fly.dev/)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
