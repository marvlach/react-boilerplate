# frontend-boilerplate

- [Installation](#installation)
- [Project Dependencies](#project-dependencies)
- [Project Structure](#project-structure)


### Installation
To install:
```
cd frontend
npm i
```
To make sure that installation worked, spawn a dev server and visit http://localhost:3000/

```
npm run dev
```

To run tests:
```
npm run test
```

To run test coverage:
```
npm run coverage
```

### Project Dependencies
The dependencies can be found in package.json. Main packages include:
1. [React router dom](https://reactrouter.com/en/main) for client side routing
2. [Redux Toolkit](https://redux-toolkit.js.org/) for global state managment
3. [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview) for http requests and react hooks
4. [Antd](https://ant.design/components/overview/) for React components

Some dev dependencies include:
1. [Vite](https://vitejs.dev/) for bundling
2. Typescript
3. [ESLint Airbnb style guidelines](https://airbnb.io/javascript/)
4. [Vitest](https://vitest.dev/) for testing
5. [MSW](https://mswjs.io/) for http server mocking
 
 
 
### Project Structure
